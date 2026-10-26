import express from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync, mkdirSync, lstatSync, renameSync } from 'node:fs'
import { join, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCommandRunner } from './commands.mjs'
import { createUnitSlug, unitSlug } from '../src/utils/unit-slug.js'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const COOKIE = 'paviliun_session'
const IMAGE_NAME = /^[a-zA-Z0-9_][a-zA-Z0-9._-]*\.(?:jpe?g|png|webp|gif)$/i
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' }
const hash = value => crypto.createHash('sha256').update(value).digest()
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const text = value => typeof value === 'string' && value.length <= 20000
const strings = value => Array.isArray(value) && value.length <= 500 && value.every(text)
const httpsURL = value => { try { return text(value) && new URL(value).protocol === 'https:' } catch { return false } }
const icon = value => value === undefined || value === '' || (text(value) && /^[a-z0-9-]+:[a-z0-9-]+$/i.test(value))

function validUnit(unit) {
  return object(unit) && text(unit.judul) && unit.judul.trim() && text(unit.desc) && text(unit.detail) &&
    ['Available', 'Not Available'].includes(unit.tag) && /^\d+$/.test(String(unit.tamu)) &&
    (unit.luas === '' || (Number.isFinite(unit.luas) && unit.luas >= 0)) &&
    strings(unit.fitur) && strings(unit.gambar) && unit.gambar.every(name => IMAGE_NAME.test(name)) &&
    Array.isArray(unit.harga) && unit.harga.length > 0 && unit.harga.every(t => object(t) && Number.isFinite(t.amount) && t.amount > 0 && text(t.satuan)) &&
    Array.isArray(unit.fasilitas) && unit.fasilitas.every(f => object(f) && text(f.nama) && icon(f.ikon)) &&
    Array.isArray(unit.rules) && unit.rules.every(r => object(r) && text(r.aturan) && icon(r.ikon)) &&
    Array.isArray(unit.order) && unit.order.every(o => object(o) && text(o.detail) && httpsURL(o.link) && icon(o.ikon))
}
function validSettings(s) {
  return object(s) && object(s.site) && ['name', 'whatsapp', 'email'].every(k => text(s.site[k])) && httpsURL(s.site.airbnbUrl) &&
    object(s.hero) && text(s.hero.title) && text(s.hero.subtitle) && IMAGE_NAME.test(s.hero.coverImage) &&
    object(s.about) && text(s.about.text) && IMAGE_NAME.test(s.about.image) &&
    object(s.location) && text(s.location.address) && httpsURL(s.location.mapEmbed) && strings(s.location.nearby) &&
    Array.isArray(s.reviews) && s.reviews.every(r => object(r) && text(r.text) && text(r.author)) &&
    object(s.footer) && text(s.footer.warning) &&
    ['customFasilitas', 'customRules'].every(k => s[k] === undefined || strings(s[k]))
}
const readJSON = file => JSON.parse(readFileSync(file, 'utf8'))
function writeJSON(file, data) {
  const temporary = `${file}.${crypto.randomUUID()}.tmp`
  try { writeFileSync(temporary, JSON.stringify(data, null, 2), { mode: 0o600 }); renameSync(temporary, file) }
  finally { if (existsSync(temporary)) unlinkSync(temporary) }
}

export function createAdminApp({ root = ROOT, password = process.env.ADMIN_PASS, now = Date.now,
  sessionTtlMs = 8 * 60 * 60 * 1000, runCommand = createCommandRunner(root) } = {}) {
  if (typeof password !== 'string' || password.length < 12) throw new Error('Set ADMIN_PASS to a password of at least 12 characters before starting the CMS.')
  const passwordHash = hash(password)
  const DATA = join(root, 'src/data/units.json')
  const SETTINGS = join(root, 'src/data/settings.json')
  const IMG = join(root, 'public/img/units')
  mkdirSync(IMG, { recursive: true })
  const sessions = new Map()
  const attempts = new Map()
  const app = express()
  app.disable('x-powered-by')
  app.use((req, res, next) => {
    res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'same-origin' })
    next()
  })
  // A same-origin custom header prevents form submissions and cross-site API calls.
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    if ((req.headers.origin && req.headers.origin !== `${req.protocol}://${req.headers.host}`) || req.headers['sec-fetch-site'] === 'cross-site') {
      return res.status(403).json({ error: 'Cross-origin requests are not allowed' })
    }
    if (!['GET', 'HEAD'].includes(req.method) && req.headers['x-requested-with'] !== 'PaviliunCMS') {
      return res.status(403).json({ error: 'Missing request header' })
    }
    next()
  })
  app.use(express.json({ limit: '1mb', inflate: false }))
  const sessionToken = req => (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1)
  const cookieOptions = req => ({ httpOnly: true, sameSite: 'strict', secure: req.secure, path: '/api' })
  function requireAuth(req, res, next) {
    const token = sessionToken(req)
    const expires = sessions.get(token)
    if (expires && expires > now()) return next()
    sessions.delete(token)
    res.status(401).json({ error: 'Unauthorized' })
  }
  app.post('/api/login', (req, res) => {
    for (const [key, expires] of sessions) if (expires <= now()) sessions.delete(key)
    for (const [key, value] of attempts) if (value.reset <= now()) attempts.delete(key)
    const state = attempts.get(req.ip) || { count: 0, reset: now() + 15 * 60 * 1000 }
    if (state.count >= 5) return res.status(429).set('Retry-After', String(Math.ceil((state.reset - now()) / 1000))).json({ error: 'Too many login attempts. Try again later.' })
    if (typeof req.body?.password !== 'string' || !crypto.timingSafeEqual(hash(req.body.password), passwordHash)) {
      state.count++; attempts.set(req.ip, state)
      return res.status(401).json({ error: 'Password salah' })
    }
    attempts.delete(req.ip)
    if (sessions.size >= 100) sessions.delete(sessions.keys().next().value)
    const token = crypto.randomBytes(32).toString('hex')
    sessions.set(token, now() + sessionTtlMs)
    res.cookie(COOKIE, token, { ...cookieOptions(req), maxAge: sessionTtlMs }).json({ ok: true })
  })
  app.get('/api/session', requireAuth, (_, res) => res.json({ ok: true }))
  app.post('/api/logout', (req, res) => {
    sessions.delete(sessionToken(req))
    res.clearCookie(COOKIE, cookieOptions(req)).json({ ok: true })
  })
  function imagePath(name) {
    if (!IMAGE_NAME.test(name)) return null
    const file = join(IMG, name)
    if (existsSync(file) && !lstatSync(file).isFile()) return null // Reject symlinks and directories.
    return file
  }
  app.get('/img/units/:name', (req, res) => {
    const file = imagePath(req.params.name)
    if (!file || !existsSync(file)) return res.sendStatus(404)
    res.set('Content-Type', MIME[extname(file).toLowerCase()]).sendFile(file)
  })
  app.get('/', (_, res) => res.set('Cache-Control', 'no-store').sendFile(join(root, 'scripts/admin.html')))
  const upload = multer({
    storage: multer.diskStorage({ destination: IMG, filename: (_, file, cb) => cb(null, `${crypto.randomUUID()}${extname(file.originalname).toLowerCase()}`) }),
    fileFilter: (_, file, cb) => cb(null, IMAGE_NAME.test(file.originalname) && MIME[extname(file.originalname).toLowerCase()] === file.mimetype),
    limits: { fileSize: 20 * 1024 * 1024, files: 50, fields: 0, parts: 50 },
  })
  app.use('/api', (req, res, next) => {
    if (['/login', '/logout', '/session'].includes(req.path)) return next()
    requireAuth(req, res, next)
  })
  app.get('/api/units', (_, res) => res.json(readJSON(DATA)))
  app.post('/api/units', (req, res) => {
    if (!validUnit(req.body)) return res.status(400).json({ error: 'Invalid unit data' })
    const units = readJSON(DATA)
    const slug = createUnitSlug(req.body.judul, units.map(unit => unitSlug(unit, units)))
    units.push({ ...req.body, slug, id: Math.max(Date.now(), ...units.map(u => u.id + 1)) })
    writeJSON(DATA, units)
    res.json({ ok: true })
  })
  app.put('/api/units/:id', (req, res) => {
    const units = readJSON(DATA)
    const idx = units.findIndex(u => u.id === Number(req.params.id))
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    const unit = { ...units[idx], ...req.body, id: units[idx].id, slug: unitSlug(units[idx], units) }
    if (!validUnit(unit)) return res.status(400).json({ error: 'Invalid unit data' })
    units[idx] = unit
    writeJSON(DATA, units)
    res.json(unit)
  })
  app.delete('/api/units/:id', (req, res) => {
    writeJSON(DATA, readJSON(DATA).filter(u => u.id !== Number(req.params.id)))
    res.json({ ok: true })
  })
  app.get('/api/settings', (_, res) => res.json(readJSON(SETTINGS)))
  app.put('/api/settings', (req, res) => {
    if (!object(req.body)) return res.status(400).json({ error: 'Invalid settings' })
    const settings = { ...readJSON(SETTINGS), ...req.body }
    if (!validSettings(settings)) return res.status(400).json({ error: 'Invalid settings' })
    writeJSON(SETTINGS, settings)
    res.json(settings)
  })
  app.get('/api/images', (_, res) => res.json(readdirSync(IMG).filter(name => IMAGE_NAME.test(name) && imagePath(name))))
  app.post('/api/upload', upload.array('files', 50), (req, res) => {
    if (!req.files?.length) return res.status(400).json({ error: 'Select JPEG, PNG, WebP, or GIF files' })
    res.json({ files: req.files.map(f => f.filename) })
  })
  app.delete('/api/images/:name', (req, res) => {
    const file = imagePath(req.params.name)
    if (!file) return res.status(400).json({ error: 'Invalid image filename' })
    const name = req.params.name
    const settings = readJSON(SETTINGS)
    // Protect case variants consistently, including on case-insensitive filesystems.
    const matches = reference => typeof reference === 'string' && reference.toLowerCase() === name.toLowerCase()
    if (readJSON(DATA).some(unit => unit.gambar?.some(matches)) ||
      matches(settings.hero?.coverImage) || matches(settings.about?.image)) {
      return res.status(409).json({ error: 'Image is in use. Remove it from Units and homepage settings before deleting it.' })
    }
    if (existsSync(file)) unlinkSync(file)
    res.json({ ok: true })
  })
  app.post('/api/deploy', (req, res) => {
    if (req.body?.token !== undefined) return res.status(400).json({ error: 'Use configured Git credentials; browser tokens are not accepted' })
    let step = 'stage content'
    try {
      const content = ['src/data/units.json', 'src/data/settings.json', 'public/img/units']
      runCommand('git', ['add', '--', ...content])
      step = 'inspect staged changes'
      if (runCommand('git', ['diff', '--cached', '--name-only', '--', ...content]).trim()) {
        step = 'commit content'; runCommand('git', ['commit', '--only', '-m', 'CMS update via admin panel', '--', ...content])
      }
      step = 'push source'; runCommand('git', ['push', 'origin', 'master'])
      step = 'build and publish'; runCommand('npm', ['run', 'deploy'])
      res.json({ ok: true })
    } catch {
      // Command stderr can contain credential-bearing URLs. Keep it out of API responses.
      res.status(500).json({ ok: false, error: `Deployment failed during: ${step}` })
    }
  })
  app.use((error, _req, res, _next) => {
    const status = error instanceof multer.MulterError || error.status === 400 ? 400 : error.status === 413 ? 413 : error.status === 415 ? 415 : 500
    res.status(status).json({ error: status === 500 ? 'Internal server error' : 'Invalid request' })
  })
  return app
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { createAdminApp().listen(3456, '127.0.0.1', () => console.log('Paviliun 900 CMS Admin listening on port 3456')) }
  catch (error) { console.error(error.message); process.exitCode = 1 }
}
