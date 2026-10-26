import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createUnitSlug, slugifyUnitTitle, unitSlug, findUnitByRoute } from '../src/utils/unit-slug.js'

test('titles become readable lowercase slugs without spaces or punctuation', () => {
  assert.equal(slugifyUnitTitle('  A21 Unit Compact & Modern  '), 'a21-unit-compact-modern')
  assert.equal(createUnitSlug('Café — O’Connor’s Stay!'), 'cafe-oconnors-stay')
  assert.equal(createUnitSlug('!!!'), 'unit')
  assert.equal(createUnitSlug('123'), 'unit-123')
})

test('duplicate and long titles produce distinct, resolvable slugs', () => {
  const first = createUnitSlug('Quiet Stay')
  const second = createUnitSlug('Quiet Stay', [first])
  assert.equal(second, 'quiet-stay-2')
  assert.equal(createUnitSlug('Quiet Stay', [first, second]), 'quiet-stay-3')
  const long = createUnitSlug('very long title '.repeat(20))
  const duplicate = createUnitSlug('very long title '.repeat(20), [long])
  const units = [{ id: 1, judul: 'Long', slug: long }, { id: 2, judul: 'Long', slug: duplicate }]
  assert.equal(findUnitByRoute(units, duplicate), units[1])
})

test('saved slugs take priority and remain stable after title edits', () => {
  const units = [{ id: 1, judul: 'Updated title', slug: 'original-name' }, { id: 2, judul: 'Original name' }]
  assert.equal(unitSlug(units[0], units), 'original-name')
  assert.equal(unitSlug(units[1], units), 'original-name-2')
  assert.equal(findUnitByRoute(units, '1'), units[0])
  assert.equal(findUnitByRoute(units, 'Original-Name'), units[0])
  assert.equal(findUnitByRoute(units, 'not-a-unit'), undefined)
})

test('older data with missing, duplicate, or unsafe slugs still gets unique links', () => {
  const units = [{ id: 1, judul: 'Stay' }, { id: 2, judul: 'Stay' }, { id: 3, judul: 'Other', slug: 'stay' }, { id: 4, judul: 'Other', slug: '../unsafe' }]
  const slugs = units.map(unit => unitSlug(unit, units))
  assert.equal(new Set(slugs).size, 4)
  assert.deepEqual(slugs, ['stay-2', 'stay-3', 'stay', 'other'])
  for (const [index, slug] of slugs.entries()) assert.equal(findUnitByRoute(units, slug), units[index])
})
