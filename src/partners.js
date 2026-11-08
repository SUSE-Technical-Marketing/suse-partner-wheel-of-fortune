import rawPartners from '../assets/partners_questions.yaml'

// Inline every logo as a data URI (see assetsInlineLimit in vite.config.js).
const logoFiles = import.meta.glob('../assets/logos/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const partners = rawPartners.map((p, i) => {
  const url = logoFiles[`../assets/${p.logo}`]
  if (!url) throw new Error(`Logo not found for "${p.name}": assets/${p.logo}`)
  return {
    id: i,
    name: p.name,
    logo: url,
    tint: p.logo_tint ?? null,
    questions: (p.questions ?? []).map((q) => ({
      question: q.question,
      options: q.options ?? null,
      answer: q.answer,
      explanation: q.explanation ?? null,
    })),
  }
})
