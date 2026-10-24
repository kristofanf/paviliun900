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
  await expect(page).toHaveURL(/\/detail\/\d+$/)
  await expect(page.locator('.detail-title')).toHaveText(title.trim())
  await page.reload()
  await expect(page.locator('.detail-title')).toHaveText(title.trim())
  await page.getByRole('button', { name: 'Show all Photos' }).click()
  await expect(page).toHaveURL(/\/image\/\d+$/)
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
  await expect(page).toHaveURL(/\/image\/1$/)
  await expect(page.locator('.gallery')).toHaveCount(11)
  expect(errors).toEqual([])
})

async function openAdmin(page, admin) {
  await page.goto(admin.base)
  await page.locator('#login-pass').fill(testPassword)
  await page.getByRole('button', { name: 'Masuk', exact: true }).click()
  await expect(page.locator('#app-page')).toBeVisible()
}

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
