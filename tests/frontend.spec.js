import { test, expect } from '@playwright/test'
import units from '../src/data/units.json' with { type: 'json' }
import settings from '../src/data/settings.json' with { type: 'json' }

test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
})

test('homepage separates stays and compares long-term prices by actual period', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Paviliun 900', exact: true })).toBeVisible()
  await expect(page.locator('.unit-card')).toHaveCount(units.length)
  const rentals = page.getByRole('region', { name: 'Long-term living' })
  await expect(rentals).toContainText('Rp 50.000.000')
  await expect(rentals).toContainText('Rp 38.000.000')
  await rentals.getByRole('button', { name: '3 months', exact: true }).click()
  await expect(rentals).toContainText('Rp 15.000.000')
  await expect(rentals).toContainText('Rp 12.000.000')
  await rentals.getByRole('button', { name: '6 months', exact: true }).click()
  await expect(rentals).toContainText('Rp 26.000.000')
  await expect(rentals).toContainText('Rp 20.000.000')
  await expect(rentals.getByText('Not Available', { exact: true })).toHaveCount(2)
  await expect(page.getByText(settings.footer.warning, { exact: true })).toBeVisible()
  for (const place of settings.location.nearby) await expect(page.getByText(place, { exact: true })).toHaveCount(1)
})

test('all reviews remain available through a manual carousel', async ({ page }) => {
  await page.goto('/#reviews')
  const reviews = page.getByRole('region', { name: 'Guest stories' })
  const seen = new Set()
  for (let i = 0; i < settings.reviews.length; i++) {
    for (const author of await reviews.locator('[data-review-author]').allTextContents()) seen.add(author.trim())
    await reviews.getByRole('button', { name: 'Next review' }).click()
  }
  for (const review of settings.reviews) expect(seen.has(review.author)).toBe(true)
})

test('long-term menu reaches the rental section from desktop and mobile detail pages', async ({ page }) => {
  for (const width of [1536, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/detail/1')
    if (width < 901) await page.getByRole('button', { name: 'Menu', exact: true }).click()
    const navigation = page.getByRole('navigation', { name: width < 901 ? 'Mobile navigation' : 'Main navigation', exact: true })
    await navigation.getByRole('link', { name: 'Long-term rent', exact: true }).click()
    await expect(page).toHaveURL(/\/#long-stays$/)
    await expect(page.getByRole('heading', { name: 'More than a visit. A place to live.' })).toBeInViewport()
    await expect(page.getByRole('dialog', { name: 'Navigation', exact: true })).not.toBeVisible()
  }
})

test('seven long-term units remain accessible in responsive grids with period prices', async ({ page }) => {
  const rentals = Array.from({ length: 7 }, (_, index) => ({ ...structuredClone(units[1]), id: 9000 + index, judul: `Long-term unit ${index + 1}` }))
  const data = [units[0], ...rentals]
  await page.route('**/src/data/units.json*', route => route.fulfill({ contentType: 'application/javascript', body: 'export default ' + JSON.stringify(data) }))
  await page.goto('/#long-stays')
  const section = page.getByRole('region', { name: 'Long-term living' })
  await expect(section.locator('.unit-card')).toHaveCount(7)
  for (const [width, columns] of [[1536, 3], [900, 2], [390, 1]]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await section.locator('.rental-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(columns)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  }
  await section.getByRole('button', { name: '3 months', exact: true }).click()
  for (const rental of rentals) {
    const card = section.locator('.unit-card').filter({ has: page.getByRole('heading', { name: rental.judul, exact: true }) })
    await expect(card.locator('.unit-price')).toHaveText('Rp 15.000.000 / 3 months')
    await expect(card.getByRole('link', { name: 'View unit', exact: true })).toHaveAttribute('href', `/detail/${rental.id}`)
  }
})

test('long-term detail preserves every rental tier and unavailable status', async ({ page }) => {
  await page.goto('/detail/2')
  await expect(page.locator('.detail-title')).toHaveText(units[1].judul)
  await expect(page.getByText('Not Available', { exact: true }).first()).toBeVisible()
  for (const tier of units[1].harga) await expect(page.getByText('Rp ' + tier.amount.toLocaleString('id-ID'), { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Check availability' }).first()).toHaveAttribute('href', /wa\.me|#contact/)
})

test('mobile menu navigates between routes and sections without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/detail/1')
  await page.getByRole('button', { name: 'Menu', exact: true }).click()
  const menu = page.getByRole('dialog', { name: 'Navigation' })
  await expect(menu).toBeVisible()
  await menu.getByRole('link', { name: 'Location', exact: true }).click()
  await expect(page).toHaveURL(/\/#location$/)
  await expect(menu).not.toBeVisible()
  await expect(page.getByRole('heading', { name: 'The city, within easy reach.' })).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  for (const path of ['/detail/2', '/image/1', '/about']) {
    await page.goto(path)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  }
})

test('gallery lightbox supports keyboard stepping, Escape and focus return', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/image/1')
  const photo = page.locator('.gallery').first()
  await photo.click()
  const dialog = page.getByRole('dialog', { name: 'Photo viewer' })
  await expect(dialog).toBeVisible()
  const before = await dialog.locator('img').getAttribute('src')
  await page.keyboard.press('ArrowRight')
  await expect(dialog.locator('img')).not.toHaveAttribute('src', before)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(photo).toBeFocused()
  expect(errors).toEqual([])
})

test('gallery filters known rooms and restores every source photograph', async ({ page }) => {
  await page.goto('/image/1')
  const filters = page.getByRole('group', { name: 'Filter photographs' })
  await filters.getByRole('button', { name: 'Bathrooms', exact: true }).click()
  await expect(page.locator('.gallery')).toHaveCount(1)
  await expect(page.locator('.gallery img')).toHaveAttribute('src', /\/km1\.jpg$/)
  await filters.getByRole('button', { name: 'All photos', exact: true }).click()
  await expect(page.locator('.gallery')).toHaveCount(units[0].gambar.length)
  for (const photo of units[0].gambar) await expect(page.locator(`.gallery img[src$="/${encodeURIComponent(photo)}"]`)).toHaveCount(1)
})

test('reduced motion keeps content visible and stops hero movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.hero h1')).toBeVisible()
  await page.locator('#units').scrollIntoViewIfNeeded()
  await expect(page.locator('.unit-card').first()).toBeVisible()
  expect(await page.locator('.hero-image').evaluate(el => el.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0)
})

test('units without photographs keep their content and never request undefined images', async ({ page }) => {
  const data = structuredClone(units)
  data[0].gambar = []
  await page.route('**/src/data/units.json*', route => route.fulfill({ contentType: 'application/javascript', body: 'export default ' + JSON.stringify(data) }))
  const badRequests = []
  page.on('request', request => { if (/\/img\/units\/(undefined|null)(?:[/?]|$)/.test(request.url())) badRequests.push(request.url()) })
  await page.goto('/')
  await expect(page.getByText('Photos coming soon', { exact: true })).toBeVisible()
  await page.goto('/detail/1')
  await expect(page.locator('.detail-title')).toHaveText(data[0].judul)
  await expect(page.locator('.hero-image')).toHaveCount(0)
  await page.getByRole('button', { name: 'Show all Photos' }).click()
  await expect(page.getByText('Photographs for this unit will be added here.', { exact: true })).toBeVisible()
  await expect(page.locator('.gallery')).toHaveCount(0)
  expect(badRequests).toEqual([])
})

test('nightly hero chooses the nightly tier when annual pricing comes first', async ({ page }) => {
  const data = structuredClone(units)
  data[0].harga.unshift({ amount: 50000000, satuan: 'year' })
  await page.route('**/src/data/units.json*', route => route.fulfill({ contentType: 'application/javascript', body: 'export default ' + JSON.stringify(data) }))
  await page.goto('/detail/1')
  await expect(page.locator('.hero-price')).toContainText('Rp 1.100.000')
  await expect(page.locator('.hero-price')).toContainText('/ night')
})

test('history navigation between unit parameters refreshes content and rental choices', async ({ page }) => {
  await page.goto('/detail/1')
  await expect(page.locator('.detail-title')).toHaveText(units[0].judul)
  await page.evaluate(() => {
    history.pushState({ ...history.state, current: '/detail/2' }, '', '/detail/2')
    dispatchEvent(new PopStateEvent('popstate', { state: history.state }))
  })
  await expect(page.locator('.detail-title')).toHaveText(units[1].judul)
  await expect(page.getByRole('radio', { name: new RegExp(units[1].harga[0].satuan + '.*' + units[1].harga[0].amount.toLocaleString('id-ID').replaceAll('.', '\\.')) })).toBeChecked()
})
