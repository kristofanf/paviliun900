import express from 'express'
import multer from 'multer'
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, mkdirSync } from 'node:fs'
import { join, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DATA = join(ROOT, 'src/data/units.json')
const SETTINGS = join(ROOT, 'src/data/settings.json')
const IMG = join(ROOT, 'public/img/units')
const PORT = 3456

mkdirSync(IMG, { recursive: true })

const MIME = { '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml' }

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use((_, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); next() })

// Static image serving middleware (Express v5 compatible)
app.use((req, res, next) => {
  if (!req.path.startsWith('/img/units/') || req.method !== 'GET') return next()
  const name = req.path.replace('/img/units/', '')
  const file = join(IMG, name)
  if (!existsSync(file)) return next()
  const mime = MIME[extname(file).toLowerCase()] || 'application/octet-stream'
  res.setHeader('Content-Type', mime)
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.sendFile(file)
})

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, IMG),
    filename: (_, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
      cb(null, safe)
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }
})

const readJSON = f => JSON.parse(readFileSync(f, 'utf-8'))
const writeJSON = (f, d) => writeFileSync(f, JSON.stringify(d, null, 2), 'utf-8')

// Serve admin UI
app.get('/', (_, res) => {
  res.sendFile(join(__dirname, 'admin.html'))
})

// --- UNITS API ---
app.get('/api/units', (_, res) => res.json(readJSON(DATA)))
app.post('/api/units', (req, res) => {
  const units = readJSON(DATA)
  const unit = { ...req.body, id: Date.now() }
  units.push(unit)
  writeJSON(DATA, units)
  res.status(201).json(unit)
})
app.put('/api/units/:id', (req, res) => {
  const units = readJSON(DATA)
  const idx = units.findIndex(u => u.id === Number(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  units[idx] = { ...units[idx], ...req.body }
  writeJSON(DATA, units)
  res.json(units[idx])
})
app.delete('/api/units/:id', (req, res) => {
  const units = readJSON(DATA).filter(u => u.id !== Number(req.params.id))
  writeJSON(DATA, units)
  res.json({ ok: true })
})

// --- SETTINGS API ---
app.get('/api/settings', (_, res) => res.json(readJSON(SETTINGS)))
app.put('/api/settings', (req, res) => {
  writeJSON(SETTINGS, req.body)
  res.json(req.body)
})

// --- IMAGES API ---
app.get('/api/images', (_, res) => {
  const files = existsSync(IMG) ? readdirSync(IMG).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f)) : []
  res.json(files)
})
app.post('/api/upload', upload.array('files', 50), (req, res) => {
  const saved = (req.files || []).map(f => f.filename)
  res.json({ files: saved })
})
app.delete('/api/images/:name', (req, res) => {
  const p = join(IMG, decodeURIComponent(req.params.name))
  if (existsSync(p)) unlinkSync(p)
  res.json({ ok: true })
})

// --- DEPLOY API ---
app.post('/api/deploy', async (req, res) => {
  const { execSync } = await import('node:child_process')
  const opts = { cwd: ROOT, encoding: 'utf-8', timeout: 120000 }
  const log = []
  try {
    log.push(execSync('git add -A', opts) || 'git add OK')
    log.push(execSync('git commit -m "CMS update via admin panel"', opts) || 'git commit OK')
    log.push(execSync('git push origin master', opts) || 'git push master OK')
    const token = req.body?.token
    if (token) {
      log.push(execSync(`GITHUB_TOKEN="${token}" npm run deploy`, { ...opts, timeout: 180000 }) || 'deploy OK')
    }
    res.json({ ok: true, log })
  } catch (e) {
    const msg = e.stdout || e.stderr || e.message
    log.push(msg)
    res.json({ ok: false, log, error: msg })
  }
})

app.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════╗`)
  console.log(`  ║   Paviliun 900 CMS Admin         ║`)
  console.log(`  ║   http://localhost:${PORT}          ║`)
  console.log(`  ╚══════════════════════════════════╝\n`)
})
