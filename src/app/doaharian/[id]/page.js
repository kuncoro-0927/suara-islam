import { cache } from 'react'
import DoaContent from './doa-idclient'

// React.cache() → generateMetadata dan DoaPage share 1 fetch call, bukan 2
const getDoaDetail = cache(async (id) => {
  try {
    const res = await fetch(`https://api.myquran.com/v2/doa/${id}`, {
      method: 'GET',
      cache: 'no-store', // <--- Memaksa ambil data segar dari API langsung, bypass cache build lama
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Menyaru sebagai browser normal agar lolos rate limit 429 dari Cloudflare API
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
    })

    if (!res.ok) return null

    const response = await res.json()
    return response.data || null
  } catch (error) {
    console.error('Error fetching doa:', error)
    return null
  }
})

export async function generateMetadata({ params }) {
  const { id } = await params  // Next.js 15: await params
  const doa = await getDoaDetail(id)

  if (!doa) {
    return {
      title: 'Doa tidak ditemukan',
      description: 'Halaman doa yang Anda cari tidak ditemukan.',
      robots: { index: false },
    }
  }

  const judul = doa.judul || `Doa ${id}`
  const indo = doa.artinya || ''

  return {
    title: judul,
    description: `${judul} dalam tulisan Arab, latin, dan terjemahan bahasa Indonesia. "${indo}"`,
    keywords: [
      judul,
      `doa ${judul}`,
      'doa harian',
      'doa islam',
      'doa sehari-hari',
      'kumpulan doa islami',
      'doa pendek',
      'bacaan doa arab latin'
    ],
    alternates: {
      canonical: `https://islam.suara.com/doaharian/${id}`,
    },
    openGraph: {
      title: judul,
      description: `${indo} — Bacaan doa harian Islam.`,
      type: 'article',
      url: `https://islam.suara.com/doaharian/${id}`,
      locale: 'id_ID',
      siteName: 'Islam Suara.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: judul,
      description: indo,
    },
  }
}

// Prerender semua 108 doa saat build
export async function generateStaticParams() {
  return Array.from({ length: 108 }, (_, i) => ({ id: String(i + 1) }))
}

export const dynamicParams = false
export const revalidate = 31536000

export default async function DoaPage({ params }) {
  const { id } = await params  // Next.js 15: await params
  const initialDoa = await getDoaDetail(id)

  return <DoaContent initialData={initialDoa} doaId={id} />
}
