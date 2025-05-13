export interface Template {
  id: number
  name: string
  description: string
  image: string
  editUrl: string
  buyUrl: string
  unlockCode: string
}

export const templateData: Template[] = [
  {
    id: 1,
    name: 'Hero Section',
    description: 'Eine große Einstiegssektion mit Titel und Farbe.',
    image: '/BG_Card_55.jpg',
    editUrl: '/editor/hero',
    buyUrl: 'https://brandupelements.com',
    unlockCode: '123'
  },
  {
    id: 2,
    name: 'Newsletter Section',
    description: 'Eine cleane Sektion zum Einsammeln von E-Mails.',
    image: '/BG_Card_55.jpg',
    editUrl: '/editor/newsletter',
    buyUrl: 'https://brandupelements.com',
    unlockCode: '123'
  }
]
