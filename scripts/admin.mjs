import { createServer } from 'node:http'
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync } from 'node:fs'
import { join, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DATA_FILE = join(ROOT, 'src/data/units.json')
const IMG_DIR = join(ROOT, 'public/img/units')
const PORT = 3456

mkdirSync(IMG_DIR, { recursive: true })

function readUnits() {
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
}
function writeUnits(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}
function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify(data))
}
function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString()
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        resolve({ raw, boundary: req.headers['content-type'].split('boundary=')[1] })
      } else {
        try { resolve(JSON.parse(raw)) } catch { resolve(raw) }
      }
    })
    req.on('error', reject)
  })
}
function parseMultipart(buf, boundary) {
  const parts = []
  const sep = `--${boundary}`
  const str = buf.toString('latin1')
  const sections = str.split(sep).slice(1, -1)
  for (const section of sections) {
    const [headerPart, ...bodyParts] = section.split('\r\n\r\n')
    const body = bodyParts.join('\r\n\r\n').replace(/\r\n$/, '')
    const nameMatch = headerPart.match(/name="([^"]+)"/)
    const fileMatch = headerPart.match(/filename="([^"]+)"/)
    if (nameMatch) {
      parts.push({ name: nameMatch[1], filename: fileMatch?.[1], data: body })
    }
  }
  return parts
}

const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' })
    return res.end()
  }
  res.setHeader('Access-Control-Allow-Origin', '*')

  const url = new URL(req.url, `http://localhost:${PORT}`)

  // Serve admin HTML
  if (url.pathname === '/' || url.pathname === '/admin') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end(readFileSync(join(__dirname, 'admin.html'), 'utf-8'))
  }

  // API: GET /api/units
  if (url.pathname === '/api/units' && req.method === 'GET') {
    return json(res, readUnits())
  }

  // API: POST /api/units (create)
  if (url.pathname === '/api/units' && req.method === 'POST') {
    const units = readUnits()
    const body = await parseBody(req)
    body.id = Date.now()
    units.push(body)
    writeUnits(units)
    return json(res, body, 201)
  }

  // API: PUT /api/units/:id (update)
  const putMatch = url.pathname.match(/^\/api\/units\/(\d+)$/)
  if (putMatch && req.method === 'PUT') {
    const units = readUnits()
    const idx = units.findIndex(u => u.id === Number(putMatch[1]))
    if (idx === -1) return json(res, { error: 'Not found' }, 404)
    const body = await parseBody(req)
    units[idx] = { ...units[idx], ...body }
    writeUnits(units)
    return json(res, units[idx])
  }

  // API: DELETE /api/units/:id
  const delMatch = url.pathname.match(/^\/api\/units\/(\d+)$/)
  if (delMatch && req.method === 'DELETE') {
    const units = readUnits()
    const filtered = units.filter(u => u.id !== Number(delMatch[1]))
    writeUnits(filtered)
    return json(res, { ok: true })
  }

  // API: POST /api/upload (multipart image upload)
  if (url.pathname === '/api/upload' && req.method === 'POST') {
    const { raw, boundary } = await parseBody(req)
    const parts = parseMultipart(raw, boundary)
    const saved = []
    for (const part of parts) {
      if (part.filename) {
        const safeName = part.filename.replace(/[^a-zA-Z0-9._-]/g, '_')
        const buf = Buffer.from(part.data, 'latin1')
        writeFileSync(join(IMG_DIR, safeName), buf)
        saved.push(safeName)
      }
    }
    return json(res, { files: saved })
  }

  // API: GET /api/images (list uploaded images)
  if (url.pathname === '/api/images' && req.method === 'GET') {
    const files = existsSync(IMG_DIR) ? readdirSync(IMG_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)) : []
    return json(res, files)
  }

  // API: DELETE /api/images/:name
  const imgDel = url.pathname.match(/^\/api\/images\/(.+)$/)
  if (imgDel && req.method === 'DELETE') {
    const filePath = join(IMG_DIR, decodeURIComponent(imgDel[1]))
    if (existsSync(filePath)) unlinkSync(filePath)
    return json(res, { ok: true })
  }

  json(res, { error: 'Not found' }, 404)
})

server.listen(PORT, () => {
  console.log(`\n  Paviliun 900 CMS Admin`)
  console.log(`  http://localhost:${PORT}\n`)
})
