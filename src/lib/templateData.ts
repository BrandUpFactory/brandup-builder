export interface Template {
  id: number
  name: string
  description: string
  image: string
  unlockCode: string
  buyUrl: string
  editUrl: string
}

export const templateData: Template[] = [
  {
    id: 1,
    name: 'Hero Section',
    description: 'Eine aufmerksamkeitsstarke Headline-Sektion.',
    image: '/BG_Card_55.jpg',
    unlockCode: '123',
    buyUrl: 'https://brandupelements.com/products/hero-section',
    editUrl: '/editor/hero'
  },
  // Weitere Templates …
]