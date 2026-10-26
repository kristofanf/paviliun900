// Shared by the public router and CMS so newly created links match saved content.
export function slugifyUnitTitle(title) {
  return String(title ?? '').normalize('NFKD').replace(/\p{M}/gu, '')
    .toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function validSlug(value) {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && !/^\d+$/.test(value)
}

export function createUnitSlug(title, taken = []) {
  let base = slugifyUnitTitle(title).slice(0, 80).replace(/-+$/g, '') || 'unit'
  if (/^\d+$/.test(base)) base = `unit-${base}` // Numeric paths remain reserved for old ID links.
  const used = new Set(taken)
  let slug = base
  for (let suffix = 2; used.has(slug); suffix++) slug = `${base}-${suffix}`
  return slug
}

function unitSlugs(units) {
  // Reserve persisted slugs first, including those later in the list.
  const reserved = units.map(unit => unit.slug).filter(validSlug)
  const assigned = new Set()
  const slugs = new Map()
  for (const unit of units) {
    const slug = validSlug(unit.slug) && !assigned.has(unit.slug)
      ? unit.slug : createUnitSlug(unit.judul, [...reserved, ...assigned])
    assigned.add(slug)
    slugs.set(String(unit.id), slug)
  }
  return slugs
}

export function unitSlug(unit, units = [unit]) {
  return unitSlugs(units).get(String(unit.id)) ?? createUnitSlug(unit.judul)
}

export function findUnitByRoute(units, value) {
  if (typeof value !== 'string' || !value) return undefined
  if (/^\d+$/.test(value)) return units.find(unit => String(unit.id) === value)
  const slug = slugifyUnitTitle(value)
  const slugs = unitSlugs(units)
  return units.find(unit => slugs.get(String(unit.id)) === slug)
}
