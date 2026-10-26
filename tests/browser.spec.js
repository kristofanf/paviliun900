import { test, expect } from '@playwright/test'
import { fixture, testPassword } from './fixture.mjs'

test.beforeEach(async ({ page }) => {
  // Core workflows must also work when optional fonts/maps/icon services are unavailable.
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
})

test('unit cards open details, gallery, lightbox, and return without runtime errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('.unit-card')).toHaveCount(3)
  const title = await page.locator('.unit-card h2').first().textContent()
  await page.locator('.unit-card h2').first().click()
  await expect(page).toHaveURL(/\/detail\/spacious-and-comfortable-airbnb$/)
  await expect(page.locator('.detail-title')).toHaveText(title.trim())
  await page.reload()
  await expect(page.locator('.detail-title')).toHaveText(title.trim())
  await page.getByRole('link', { name: 'View all photos (11)', exact: true }).click()
  await expect(page).toHaveURL(/\/image\/spacious-and-comfortable-airbnb$/)
  await expect(page.locator('.gallery').first()).toBeVisible()
  await page.locator('.gallery').first().click()
  await expect(page.locator('.overlay')).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(page.locator('.overlay')).toHaveCount(0)
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await expect(page.locator('.detail-title')).toHaveText(title.trim())
  expect(errors).toEqual([])
})

test('missing, invalid, malformed legacy, and valid legacy unit links are handled', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/detail')
  await expect(page).toHaveURL(/\/$/)
  await page.evaluate(() => sessionStorage.setItem('unit', '{bad-json'))
  await page.goto('/image')
  await expect(page).toHaveURL(/\/$/)
  await page.goto('/detail/not-a-unit')
  await expect(page).toHaveURL(/\/$/)
  await page.evaluate(() => sessionStorage.setItem('unit', JSON.stringify({ id: 1 })))
  await page.goto('/image')
  await expect(page).toHaveURL(/\/image\/spacious-and-comfortable-airbnb$/)
  await expect(page.locator('.gallery')).toHaveCount(11)
  expect(errors).toEqual([])
})

async function openAdmin(page, admin) {
  await page.goto(admin.base)
  await page.locator('#login-pass').fill(testPassword)
  await page.getByRole('button', { name: 'Masuk', exact: true }).click()
  await expect(page.locator('#app-page')).toBeVisible()
}

for (const mode of ['edit', 'copy', 'new']) {
  test(`photo uploads preserve ${mode} Unit drafts through save`, async ({ page }) => {
    const admin = await fixture()
    try {
      await admin.login()
      const units = await (await admin.request('/api/units')).json()
      const booking = [{ detail: 'Book direct', link: 'https://example.com/booking', ikon: 'mdi:calendar' }]
      await admin.request('/api/units/1', { method: 'PUT', body: JSON.stringify({ order: booking }) })
      await openAdmin(page, admin)
      await page.evaluate(mode => mode === 'copy' ? copyUnit(1) : editUnit(mode === 'edit' ? 1 : 0), mode)
      await expect(page.locator('#fu-judul')).toHaveValue(mode === 'copy' ? units[0].judul + ' (Copy)' : mode === 'edit' ? units[0].judul : '')
      await page.locator('#fu-judul').fill('Draft title ' + mode)
      await page.locator('#fu-desc').fill('Unsaved description')
      await page.locator('#fu-detail').fill('Unsaved full details')
      await page.locator('#fu-tamu').fill('4')
      await page.locator('#fu-luas').fill('85')
      await page.locator('.tier-amount').first().fill('2500000')
      await page.locator('.tier-amount').first().dispatchEvent('input')
      await page.locator('.tier-satuan').first().selectOption('month')
      await page.locator('input[name=imgs][value="cover.jpg"]').check()
      const facilities = await page.locator('#fac-list').textContent()
      const rules = await page.locator('#rule-list').textContent()
      const uploaded = page.waitForResponse(r => r.url().endsWith('/api/upload') && r.request().method() === 'POST')
      await page.locator('#fu-upload-input').setInputFiles({ name: 'new.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64') })
      const filename = (await (await uploaded).json()).files[0]
      await expect(page.locator(`input[name=imgs][value="${filename}"]`)).toBeChecked()
      await expect(page.locator('#fu-judul')).toHaveValue('Draft title ' + mode)
      await expect(page.locator('#fu-desc')).toHaveValue('Unsaved description')
      await expect(page.locator('#fac-list')).toHaveText(facilities)
      await expect(page.locator('#rule-list')).toHaveText(rules)
      await expect(page.locator('input[name=imgs][value="cover.jpg"]')).toBeChecked()
      await page.getByRole('button', { name: 'Simpan', exact: true }).click()
      await expect(page.locator('#fu-judul')).toHaveCount(0)
      await page.reload()
      await expect(page.locator('.unit-info')).toContainText(['Draft title ' + mode])
      const saved = (await (await admin.request('/api/units')).json()).find(u => u.judul === 'Draft title ' + mode)
      expect(saved).toMatchObject({ desc: 'Unsaved description', detail: 'Unsaved full details', tamu: '4', luas: 85 })
      expect(saved.harga[0]).toEqual({ amount: 2500000, satuan: 'month' })
      expect(saved.gambar).toEqual(expect.arrayContaining(['cover.jpg', filename]))
      if (mode !== 'new') expect(saved.order).toEqual(booking)
    } finally { await admin.close() }
  })
}

test('failed photo uploads leave the draft editable', async ({ page }) => {
  const admin = await fixture()
  try {
    await openAdmin(page, admin)
    await page.evaluate(() => editUnit(1))
    await page.locator('#fu-judul').fill('Keep this draft')
    await page.route('**/api/upload', route => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Upload failed' }) }))
    await page.locator('#fu-upload-input').setInputFiles({ name: 'bad.png', mimeType: 'image/png', buffer: Buffer.from('test') })
    await expect(page.locator('#modal-body')).toContainText('Upload failed')
    await page.keyboard.press('Escape')
    await expect(page.locator('#fu-judul')).toHaveValue('Keep this draft')
    await expect(page.locator('#fu-upload-input')).toBeEnabled()
  } finally { await admin.close() }
})

test('late photo uploads do not modify a different Unit editor', async ({ page }) => {
  const admin = await fixture()
  let releaseUpload
  const gate = new Promise(resolve => { releaseUpload = resolve })
  try {
    await openAdmin(page, admin)
    await page.evaluate(() => editUnit(1))
    let notifyStarted
    const started = new Promise(resolve => { notifyStarted = resolve })
    await page.route('**/api/upload', async route => {
      notifyStarted()
      await gate
      await route.continue()
    })
    const originalInput = await page.locator('#fu-upload-input').elementHandle()
    await page.locator('#fu-upload-input').setInputFiles({ name: 'late.png', mimeType: 'image/png', buffer: Buffer.from('test') })
    await started
    await page.evaluate(() => editUnit(2))
    await page.locator('#fu-judul').fill('Different editor draft')
    const photos = await page.locator('input[name=imgs]:checked').evaluateAll(inputs => inputs.map(input => input.value))
    const refreshed = page.waitForResponse(r => r.url().endsWith('/api/images'))
    releaseUpload()
    await refreshed
    await page.waitForFunction(input => !input.disabled, originalInput)
    await expect(page.locator('#fu-judul')).toHaveValue('Different editor draft')
    expect(await page.locator('input[name=imgs]:checked').evaluateAll(inputs => inputs.map(input => input.value))).toEqual(photos)
  } finally { releaseUpload(); await page.unroute('**/api/upload'); await admin.close() }
})

test('admin login survives reload, uses private cookies, and logout revokes access', async ({ page, context }) => {
  const admin = await fixture()
  try {
    await page.goto(admin.base)
    await page.evaluate(() => { localStorage.setItem('gh_token', 'legacy-credential-canary'); sessionStorage.setItem('auth', 'legacy-session-canary') })
    await openAdmin(page, admin)
    const storage = await page.evaluate(() => ({ auth: sessionStorage.getItem('auth'), github: localStorage.getItem('gh_token'), cookies: document.cookie }))
    expect(storage).toEqual({ auth: null, github: null, cookies: '' })
    const cookies = await context.cookies(admin.base + '/api/session')
    expect(cookies.find(c => c.name === 'paviliun_session')).toMatchObject({ httpOnly: true, sameSite: 'Strict' })
    await page.reload()
    await expect(page.locator('#app-page')).toBeVisible()
    await page.locator('#logout-btn').click()
    await expect(page.locator('#login-page')).toBeVisible()
    await page.reload()
    await expect(page.locator('#login-page')).toBeVisible()
  } finally { await admin.close() }
})

test('stored HTML is displayed as text in unit, settings, facility, and rule rendering', async ({ page }) => {
  const admin = await fixture()
  const attack = '<img src="/x" onerror="window.__xss=true"> & "quoted"'
  try {
    await admin.login()
    const settings = await (await admin.request('/api/settings')).json()
    await admin.request('/api/settings', { method: 'PUT', body: JSON.stringify({ location: { ...settings.location, nearby: [attack] }, customFasilitas: [attack + '||mdi:test'] }) })
    await admin.request('/api/units/1', { method: 'PUT', body: JSON.stringify({ judul: attack, fasilitas: [{ nama: attack, ikon: 'mdi:test' }], rules: [{ aturan: attack, ikon: 'mdi:test' }] }) })
    await openAdmin(page, admin)
    await expect(page.locator('.unit-info strong').first()).toHaveText(attack)
    await expect(page.locator('#hl-nearby')).toContainText(attack)
    await page.evaluate(() => editUnit(1))
    await expect(page.locator('#fac-list')).toContainText(attack)
    await expect(page.locator('#rule-list')).toContainText(attack)
    await expect(page.locator('#fu-judul')).toHaveValue(attack)
    await expect(page.locator('img[onerror]')).toHaveCount(0)
    expect(await page.evaluate(() => window.__xss)).toBeUndefined()
    await page.evaluate(() => { mPrompt('Test', '" onfocus="window.__xss=true', '" autofocus onfocus="window.__xss=true') })
    await expect(page.locator('#modal-input')).not.toHaveAttribute('onfocus')
    expect(await page.evaluate(() => window.__xss)).toBeUndefined()
    await page.keyboard.press('Escape')
  } finally { await admin.close() }
})

test('homepage settings save preserves custom lists and literal text', async ({ page }) => {
  const admin = await fixture()
  try {
    await admin.login()
    const custom = { customFasilitas: ['A & B||mdi:test'], customRules: ['Quiet <hours>||mdi:test'] }
    await admin.request('/api/settings', { method: 'PUT', body: JSON.stringify(custom) })
    await openAdmin(page, admin)
    await page.locator('[data-page="homepage"]').click()
    await page.locator('#hh-title').fill('Updated & still literal')
    await page.getByRole('button', { name: 'Simpan Semua Pengaturan' }).click()
    await expect(page.locator('#modal-overlay')).toHaveClass(/show/)
    const saved = await (await admin.request('/api/settings')).json()
    expect(saved).toMatchObject(custom)
    expect(saved.hero.title).toBe('Updated & still literal')
  } finally { await admin.close() }
})

test('failed deployment is displayed as a failure and re-enables the button', async ({ page }) => {
  const admin = await fixture()
  try {
    await openAdmin(page, admin)
    await page.locator('#deploy-btn').click()
    await expect(page.locator('#deploy-toast')).toContainText('Deployment failed during: stage content')
    await expect(page.locator('#deploy-toast')).not.toContainText('Deployed!')
    await expect(page.locator('#deploy-btn')).toBeEnabled()
  } finally { await admin.close() }
})
