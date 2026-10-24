import { test } from 'node:test'
import assert from 'node:assert/strict'
import { writeFileSync, readFileSync, existsSync, symlinkSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import http from 'node:http'
import { spawnSync } from 'node:child_process'
import { createAdminApp } from '../scripts/admin.mjs'
import { fixture, repository } from './fixture.mjs'

const json = body => ({ method: 'PUT', body: JSON.stringify(body) })
async function setup(t, options) { const f = await fixture(options); t.after(() => f.close()); return f }

test('startup rejects missing and weak passwords without printing credentials', () => {
  for (const password of [undefined, '', 'paviliun900']) assert.throws(() => createAdminApp({ password }), /ADMIN_PASS/)
  const result = spawnSync(process.execPath, ['scripts/admin.mjs'], { cwd: repository, env: { ...process.env, ADMIN_PASS: 'short' }, encoding: 'utf8' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /ADMIN_PASS/)
  assert.ok(!result.stderr.includes('short'))
})

test('login issues a private expiring cookie, logout revokes it, and legacy tokens fail', async t => {
  const f = await setup(t)
  assert.equal((await f.request('/api/units')).status, 401)
  const response = await f.login()
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.match(response.headers.get('set-cookie'), /HttpOnly/)
  assert.match(response.headers.get('set-cookie'), /SameSite=Strict/)
  assert.match(response.headers.get('set-cookie'), /Max-Age=/)
  assert.equal((await f.request('/api/units')).status, 200)
  assert.equal((await f.request('/api/units', { headers: { Cookie: '', 'X-Auth-Token': 'old-persistent-token' } })).status, 401)
  await f.request('/api/logout', { method: 'POST' })
  assert.equal((await f.request('/api/units')).status, 401)
})

test('expired sessions and sessions issued by an earlier server cannot be reused', async t => {
  let now = 1000
  const f = await setup(t, { now: () => now, sessionTtlMs: 100 })
  await f.login()
  now += 101
  assert.equal((await f.request('/api/units')).status, 401)
  await f.login()
  const fresh = await setup(t, { password: 'changed-test-password-12345' })
  assert.equal((await fresh.request('/api/units', { headers: { Cookie: f.cookie } })).status, 401)
})

test('login attempts are throttled and recover after the cooldown', async t => {
  let now = 1000
  const f = await setup(t, { now: () => now })
  for (let i = 0; i < 5; i++) assert.equal((await f.login('wrong')).status, 401)
  assert.equal((await f.login()).status, 429)
  now += 15 * 60 * 1000 + 1
  assert.equal((await f.login()).status, 200)
})

test('cross-origin and simple form API requests are rejected', async t => {
  const f = await setup(t)
  await f.login()
  assert.equal((await f.request('/api/settings', { ...json({}), headers: { Origin: 'https://attacker.invalid' } })).status, 403)
  assert.equal((await f.request('/api/logout', { method: 'POST', headers: { 'X-Requested-With': '' } })).status, 403)
  assert.equal((await f.request('/api/units', { headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403)
})

test('raw, encoded, and symlink image reads cannot escape the image library', async t => {
  const f = await setup(t)
  writeFileSync(join(f.root, 'canary.png'), 'outside-image-library')
  const raw = await new Promise((resolve, reject) => http.get(f.base + '/unused', { path: '/img/units/../../../canary.png' }, res => { res.resume(); res.on('end', () => resolve(res.statusCode)) }).on('error', reject))
  assert.equal(raw, 404)
  for (const name of ['..%2f..%2f..%2fcanary.png', '%252e%252e%252fcanary.png']) assert.equal((await f.request('/img/units/' + name)).status, 404)
  symlinkSync(join(f.root, 'canary.png'), join(f.root, 'public/img/units/link.png'))
  assert.equal((await f.request('/img/units/link.png')).status, 404)
  writeFileSync(join(f.root, 'public/img/units/safe.png'), 'safe-image')
  const image = await f.request('/img/units/safe.png')
  assert.equal(image.status, 200)
  assert.equal(image.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(await image.text(), 'safe-image')
})

test('encoded and symlink deletion attempts leave outside files untouched', async t => {
  const f = await setup(t)
  await f.login()
  writeFileSync(join(f.root, 'canary.png'), 'outside-image-library')
  symlinkSync(join(f.root, 'canary.png'), join(f.root, 'public/img/units/link.png'))
  for (const name of ['..%2f..%2f..%2fcanary.png', '%252e%252e%252fcanary.png', 'link.png']) {
    assert.equal((await f.request('/api/images/' + name, { method: 'DELETE' })).status, 400)
  }
  assert.equal(readFileSync(join(f.root, 'canary.png'), 'utf8'), 'outside-image-library')
  writeFileSync(join(f.root, 'public/img/units/safe.png'), 'safe')
  assert.equal((await f.request('/api/images/safe.png', { method: 'DELETE' })).status, 200)
  assert.equal(existsSync(join(f.root, 'public/img/units/safe.png')), false)
})

test('uploads reject active content and give images unique filenames', async t => {
  const f = await setup(t)
  await f.login()
  const form = new FormData()
  form.append('files', new Blob(['<svg onload="alert(1)"></svg>'], { type: 'image/svg+xml' }), 'attack.svg')
  assert.equal((await f.request('/api/upload', { method: 'POST', body: form })).status, 400)
  const files = []
  for (let i = 0; i < 2; i++) {
    const form = new FormData()
    form.append('files', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64')], { type: 'image/png' }), 'photo.png')
    const response = await f.request('/api/upload', { method: 'POST', body: form })
    assert.equal(response.status, 200)
    files.push((await response.json()).files[0])
  }
  assert.notEqual(files[0], files[1])
  assert.equal((await f.request('/img/units/' + files[0])).status, 200)
})

test('referenced Unit, hero, and about images cannot be deleted', async t => {
  const f = await setup(t)
  await f.login()
  const units = await (await f.request('/api/units')).json()
  const settings = await (await f.request('/api/settings')).json()
  const unitPhoto = units[0].gambar[0]
  writeFileSync(join(f.root, 'public/img/units', unitPhoto), 'unit-photo')
  for (const name of [unitPhoto, settings.hero.coverImage, settings.about.image]) {
    for (const variant of [name.toUpperCase(), name]) {
      const response = await f.request('/api/images/' + variant, { method: 'DELETE' })
      assert.equal(response.status, 409, variant)
      assert.match((await response.json()).error, /in use/i)
      assert.equal(existsSync(join(f.root, 'public/img/units', name)), true)
    }
  }
  assert.deepEqual(await (await f.request('/api/units')).json(), units)
  assert.deepEqual(await (await f.request('/api/settings')).json(), settings)
  for (const unit of units) {
    assert.equal((await f.request('/api/units/' + unit.id, json({ gambar: unit.gambar.filter(name => name !== unitPhoto) })) ).status, 200)
  }
  assert.equal((await f.request('/api/images/' + unitPhoto, { method: 'DELETE' })).status, 200)
  assert.equal(existsSync(join(f.root, 'public/img/units', unitPhoto)), false)
})

test('partial settings updates preserve custom lists and reject broken settings', async t => {
  const f = await setup(t)
  await f.login()
  const lists = { customFasilitas: ['Custom & facility||mdi:test'], customRules: ['Custom rule||mdi:test'] }
  assert.equal((await f.request('/api/settings', json(lists))).status, 200)
  const settings = await (await f.request('/api/settings')).json()
  assert.equal((await f.request('/api/settings', json({ hero: { ...settings.hero, title: 'Updated title' } }))).status, 200)
  const saved = await (await f.request('/api/settings')).json()
  assert.deepEqual(saved.customFasilitas, lists.customFasilitas)
  assert.deepEqual(saved.customRules, lists.customRules)
  assert.equal(saved.hero.title, 'Updated title')
  for (const invalid of [null, [], { site: null }, { location: { ...settings.location, mapEmbed: 'javascript:alert(1)' } }]) assert.equal((await f.request('/api/settings', json(invalid))).status, 400)
  assert.equal((await (await f.request('/api/settings')).json()).hero.title, 'Updated title')
})

test('unit edits preserve IDs and reject invalid content without changing data', async t => {
  const f = await setup(t)
  await f.login()
  const units = await (await f.request('/api/units')).json()
  const first = units[0]
  assert.equal((await f.request('/api/units/' + first.id, json({ id: 999, judul: 'Updated unit' }))).status, 200)
  assert.equal((await (await f.request('/api/units')).json())[0].id, first.id)
  assert.equal((await f.request('/api/units', { method: 'POST', body: '{}' })).status, 400)
  assert.equal((await f.request('/api/units/' + first.id, json({ order: [{ detail: 'bad', link: 'javascript:alert(1)' }] }))).status, 400)
  assert.equal((await f.request('/api/units/' + first.id, json({ judul: first.judul }))).status, 200)
})

test('deploy rejects browser tokens before invoking a command', async t => {
  const commands = []
  const f = await setup(t, { runCommand: (...args) => { commands.push(args); return '' } })
  await f.login()
  assert.equal((await f.request('/api/deploy', { method: 'POST', body: JSON.stringify({ token: '$(touch should-not-exist)' }) })).status, 400)
  assert.deepEqual(commands, [])
})

test('deployment stops at the first error and returns failure without command output', async t => {
  const commands = []
  const f = await setup(t, { runCommand: (file, args) => { commands.push([file, args]); if (args[0] === 'push') throw new Error('credential-that-must-not-leak'); return args[0] === 'diff' ? 'src/data/units.json' : '' } })
  await f.login()
  const response = await f.request('/api/deploy', { method: 'POST', body: '{}' })
  assert.equal(response.status, 500)
  const body = await response.json()
  assert.equal(body.ok, false)
  assert.match(body.error, /push source/)
  assert.ok(!JSON.stringify(body).includes('credential-that-must-not-leak'))
  assert.equal(commands.at(-1)[1][0], 'push')
  assert.ok(!commands.some(([file]) => file === 'npm'))
})

test('no-change deployments still build and publish with argument arrays', async t => {
  const commands = []
  const f = await setup(t, { runCommand: (file, args) => { commands.push([file, args]); return '' } })
  await f.login()
  const response = await f.request('/api/deploy', { method: 'POST', body: '{}' })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.ok(!commands.some(([, args]) => args[0] === 'commit'))
  assert.deepEqual(commands.at(-1), ['npm', ['run', 'deploy']])
})

test('build/publish failures never produce success', async t => {
  const f = await setup(t, { runCommand: (file) => { if (file === 'npm') throw new Error('build failed'); return '' } })
  await f.login()
  const response = await f.request('/api/deploy', { method: 'POST', body: '{}' })
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { ok: false, error: 'Deployment failed during: build and publish' })
})

test('command runner launches npm without a shell and preserves literal arguments', async t => {
  const f = await setup(t)
  const { createCommandRunner } = await import('../scripts/commands.mjs')
  const run = createCommandRunner(f.root)
  assert.match(run('npm', ['--version']).trim(), /^\d+\.\d+\.\d+$/)
  const literal = 'spaces & $(do-not-execute) "quoted"'
  assert.equal(run(process.execPath, ['-e', 'process.stdout.write(process.argv[1])', literal]), literal)
  assert.throws(() => run(process.execPath, ['-e', 'process.exit(7)']))
})

test('publication works with a main branch and stops after a failed build', async t => {
  const f = await setup(t)
  const { createCommandRunner } = await import('../scripts/commands.mjs')
  const { deployStatic } = await import('../scripts/deploy.mjs')
  mkdirSync(join(f.root, 'dist'))
  writeFileSync(join(f.root, 'dist/index.html'), '<html>test-build</html>')
  const run = createCommandRunner(f.root)
  const pushes = []
  let failBuild = false
  const runCommand = (file, args, options) => {
    if (file === 'npm') {
      assert.deepEqual(args, ['run', 'build'])
      if (failBuild) throw new Error('build failed')
      return ''
    }
    if (args[0] === 'push') { pushes.push(args); return '' }
    const gitArgs = args[0] === 'init' ? [...args, '--initial-branch=main'] : args
    return run(file, ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', ...gitArgs], options)
  }
  deployStatic({ root: f.root, runCommand })
  assert.equal(readFileSync(join(f.root, 'dist/404.html'), 'utf8'), '<html>test-build</html>')
  assert.equal(readFileSync(join(f.root, 'dist/CNAME'), 'utf8').trim(), 'paviliun900.com')
  assert.deepEqual(pushes, [['push', '-f', 'https://github.com/kristofanf/paviliun900.git', 'HEAD:production']])
  assert.equal(run('git', ['branch', '--show-current'], { cwd: join(f.root, 'dist') }).trim(), 'main')
  failBuild = true
  assert.throws(() => deployStatic({ root: f.root, runCommand }), /build failed/)
  assert.equal(pushes.length, 1, 'failed build must not attempt another push')
  for (const failingStep of ['init', 'add', 'commit', 'push']) {
    const attempted = []
    assert.throws(() => deployStatic({ root: f.root, runCommand: (file, args) => {
      attempted.push(file === 'npm' ? 'build' : args[0])
      if (args[0] === failingStep) throw new Error('injected Git failure')
      return ''
    } }), /injected Git failure/)
    assert.deepEqual(attempted, ['build', 'init', 'add', 'commit', 'push'].slice(0, ['build', 'init', 'add', 'commit', 'push'].indexOf(failingStep) + 1))
  }
})
