export const STAR_MAX = 5

export const STAR_LEVELS = [
  { min: 100, stars: 5, label: '5 Estrellas' },
  { min: 70, stars: 3.5, label: '3.5 Estrellas' },
  { min: 50, stars: 2.5, label: '2.5 Estrellas' },
  { min: 30, stars: 1.5, label: '1.5 Estrellas' },
  { min: 0.01, stars: 1, label: '1 Estrella' },
]

export function calculateStars(pv) {
  const value = Number(pv) || 0
  if (value <= 0) return 0
  const level = STAR_LEVELS.find((l) => value >= l.min)
  return level ? level.stars : 1
}

export function clampStars(value) {
  const v = Number(value) || 0
  const rounded = Math.round(v * 2) / 2
  return Math.min(Math.max(rounded, 0), STAR_MAX)
}