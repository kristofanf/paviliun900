import { mkdtempSync, mkdirSync, copyFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createAdminApp } from '../scripts/admin.mjs'

export const repository = fileURLToPath(new URL('..', import.meta.url))
export const testPassword = 'test-only-password-12345'
export async function fixture(options = {}) {
  const root = mkdtempSync(join(tmpdir(), 'paviliun-test-'))
  for (const name of ['src/data', 'public/img/units', 'scripts']) mkdirSync(join(root, name), { recursive: true })
  for (const name of ['src/data/units.json', 'src/data/settings.json', 'scripts/admin.html']) copyFileSync(join(repository, name), join(root, name))
  for (const name of ['cover.jpg', 'lorong.jpg']) copyFileSync(join(repository, 'public/img/units', name), join(root, 'public/img/units', name))
  const app = createAdminApp({ root, password: testPassword, runCommand: () => { throw new Error('Real deployment is forbidden in tests') }, ...options })
  const server = await new Promise(resolve => { const server = app.listen(0, '127.0.0.1', () => resolve(server)) })
  const base = `http://127.0.0.1:${server.address().port}`
  let cookie = ''
  const request = (path, options = {}) => fetch(base + path, {
    ...options,
    headers: { 'X-Requested-With': 'PaviliunCMS', ...(cookie ? { Cookie: cookie } : {}), ...(typeof options.body === 'string' ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  })
  const login = async (password = testPassword) => {
    const response = await request('/api/login', { method: 'POST', body: JSON.stringify({ password }) })
    cookie = response.headers.get('set-cookie')?.split(';')[0] || ''
    return response
  }
  return { root, base, app, request, login, get cookie() { return cookie }, async close() {
    await new Promise((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve())
      server.closeAllConnections()
    })
    rmSync(root, { recursive: true, force: true })
  } }
}
