import express from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, mkdirSync } from 'node:fs'
import { join, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DATA = join(ROOT, 'src/data/units.json')
const SETTINGS = join(ROOT, 'src/data/settings.json')
const IMG = join(ROOT, 'public/img/units')
const AUTH_FILE = join(__dirname, '.auth.json')
const PORT = 3456

mkdirSync(IMG, { recursive: true })

// --- AUTH ---
const ADMIN_PASS = process.env.ADMIN_PASS || 'paviliun900'

function getAuthToken() {
  if (!existsSync(AUTH_FILE)) {
    const token = crypto.randomBytes(32).toString('hex')
    writeFileSync(AUTH_FILE, JSON.stringify({ token }))
    return token
  }
  return JSON.parse(readFileSync(AUTH_FILE, 'utf-8')).token
}
const AUTH_TOKEN = getAuthToken()

const MIME = { '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml' }
const SHELL = process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : '/bin/bash'
const execOpts = { cwd: ROOT, encoding: 'utf-8', shell: SHELL, timeout: 180000 }
function run(cmd) {
  try { return execSync(cmd, execOpts).trim() || 'OK' }
  catch (e) { return e.stdout?.trim() || e.stderr?.trim() || e.message }
}

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use((_, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); next() })

// --- LOGIN ---
app.post('/api/login', (req, res) => {
  if (req.body?.password === ADMIN_PASS) return res.json({ ok: true, token: AUTH_TOKEN })
  res.status(401).json({ ok: false, error: 'Password salah' })
})

// --- AUTH MIDDLEWARE ---
function requireAuth(req, res, next) {
  if (req.headers['x-auth-token'] === AUTH_TOKEN) return next()
  res.status(401).json({ error: 'Unauthorized' })
}

// Static image serving
app.use((req, res, next) => {
  if (req.method !== 'GET' || !req.path.startsWith('/img/units/')) return next()
  const file = join(IMG, req.path.replace('/img/units/', ''))
  if (!existsSync(file)) return next()
  res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] || 'application/octet-stream')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.sendFile(file)
})

app.get('/', (_, res) => res.sendFile(join(__dirname, 'admin.html')))

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, IMG),
    filename: (_, file, cb) => cb(null, file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'))
  }),
  limits: { fileSize: 20 * 1024 * 1024 }
})

const readJSON = f => JSON.parse(readFileSync(f, 'utf-8'))
const writeJSON = (f, d) => writeFileSync(f, JSON.stringify(d, null, 2), 'utf-8')

// --- PROTECTED API ---
app.get('/api/units', requireAuth, (_, res) => res.json(readJSON(DATA)))
app.post('/api/units', requireAuth, (req, res) => {
  const units = readJSON(DATA)
  units.push({ ...req.body, id: Date.now() })
  writeJSON(DATA, units)
  res.json({ ok: true })
})
app.put('/api/units/:id', requireAuth, (req, res) => {
  const units = readJSON(DATA)
  const idx = units.findIndex(u => u.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  units[idx] = { ...units[idx], ...req.body }
  writeJSON(DATA, units)
  res.json(units[idx])
})
app.delete('/api/units/:id', requireAuth, (req, res) => {
  writeJSON(DATA, readJSON(DATA).filter(u => u.id !== Number(req.params.id)))
  res.json({ ok: true })
})

app.get('/api/settings', requireAuth, (_, res) => res.json(readJSON(SETTINGS)))
app.put('/api/settings', requireAuth, (req, res) => { writeJSON(SETTINGS, req.body); res.json(req.body) })

app.get('/api/images', requireAuth, (_, res) => {
  res.json(existsSync(IMG) ? readdirSync(IMG).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f)) : [])
})
app.post('/api/upload', requireAuth, upload.array('files', 50), (req, res) => {
  res.json({ files: (req.files || []).map(f => f.filename) })
})
app.delete('/api/images/:name', requireAuth, (req, res) => {
  const p = join(IMG, decodeURIComponent(req.params.name))
  if (existsSync(p)) unlinkSync(p)
  res.json({ ok: true })
})

app.post('/api/deploy', requireAuth, (req, res) => {
  const log = []
  log.push(run('git add -A'))
  const commitOut = run('git commit -m "CMS update via admin panel"')
  log.push(commitOut)
  if (commitOut.includes('nothing to commit')) return res.json({ ok: true, log: [...log, 'No changes to deploy'] })
  log.push(run('git push origin master'))
  if (req.body?.token) log.push(run(`GITHUB_TOKEN="${req.body.token}" npm run deploy`))
  res.json({ ok: true, log })
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  ╔══════════════════════════════════╗`)
  console.log(`  ║   Paviliun 900 CMS Admin         ║`)
  console.log(`  ║   http://localhost:${PORT}          ║`)
  console.log(`  ║   Password: ${ADMIN_PASS.padEnd(20)}║`)
  console.log(`  ╚══════════════════════════════════╝\n`)
})
