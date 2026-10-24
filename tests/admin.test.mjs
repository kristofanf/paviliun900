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

test('deployment script works with a main branch and keeps credentials out of Git arguments', async t => {
  const f = await setup(t)
  mkdirSync(join(f.root, 'bin'))
  mkdirSync(join(f.root, 'dist'))
  writeFileSync(join(f.root, 'dist/index.html'), '<html>test-build</html>')
  writeFileSync(join(f.root, 'bin/npm'), '#!/bin/sh\nexit "${TEST_BUILD_EXIT:-0}"\n', { mode: 0o755 })
  const gitExecutable = spawnSync('which', ['git'], { encoding: 'utf8' }).stdout.trim()
  writeFileSync(join(f.root, 'bin/git'), `#!${process.execPath}\n` + `
const {spawnSync}=require('node:child_process');
const {appendFileSync}=require('node:fs');
const args=process.argv.slice(2);
if(args[0]==='push'){
  appendFileSync(process.env.TEST_GIT_LOG,JSON.stringify(args)+'\\n');
  process.exit(0);
}
if(args[0]==='init')args.push('--initial-branch=main');
const result=spawnSync(${JSON.stringify(gitExecutable)},['-c','user.name=Test','-c','user.email=test@example.invalid',...args],{stdio:'ignore'});
process.exit(result.status??1);
`, { mode: 0o755 })
  const log = join(f.root, 'git-arguments.jsonl')
  const env = { ...process.env, PATH: join(f.root, 'bin') + ':' + process.env.PATH, TEST_GIT_LOG: log, GITHUB_TOKEN: 'test-credential-canary' }
  const result = spawnSync('sh', [join(repository, 'deploy.sh')], { cwd: f.root, env, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const args = JSON.parse(readFileSync(log, 'utf8').trim())
  assert.equal(args.at(-1), 'HEAD:production')
  assert.ok(!args.join(' ').includes(env.GITHUB_TOKEN))
  assert.equal(spawnSync(gitExecutable, ['branch', '--show-current'], { cwd: join(f.root, 'dist'), encoding: 'utf8' }).stdout.trim(), 'main')
  const failure = spawnSync('sh', [join(repository, 'deploy.sh')], { cwd: f.root, env: { ...env, TEST_BUILD_EXIT: '7' }, encoding: 'utf8' })
  assert.equal(failure.status, 7)
  assert.equal(readFileSync(log, 'utf8').trim().split('\n').length, 1, 'failed build must not attempt another push')
})
