import TahlilClient from './tahlilclient'

async function getTahlilData() {
  try {
    const res = await fetch('https://islamic-api-zhirrr.vercel.app/api/tahlil', {
      next: { 
        revalidate: 31536000, 
        tags: ['tahlil']
      },
      cache: 'force-cache',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=31536000'
      }
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch tahlil data')
    }
    
    const response = await res.json()
    return response.data || []
  } catch (error) {
    console.error('Error fetching tahlil:', error)
    return []
  }
}

export const metadata = {
  title: 'Bacaan Tahlil Lengkap & Terjemahan',
  description: 'Bacaan tahlil lengkap dengan arab, latin, dan terjemahan.',
  keywords: ['tahlil', 'bacaan tahlil', 'tahlil lengkap', 'bacaan tahlil arab latin'],
  openGraph: {
    title: 'Bacaan Tahlil Lengkap & Terjemahan',
    description: 'Bacaan tahlil lengkap dengan arab, latin, dan terjemahan.',
    url: 'https://islam.suara.com/tahlil',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Islam Suara.com',
  },
  alternates: {
    canonical: 'https://islam.suara.com/tahlil',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default async function TahlilPage() {
  const tahlilData = await getTahlilData()
  
  return <TahlilClient initialData={tahlilData} />
}