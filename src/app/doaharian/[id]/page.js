import { cache } from 'react'
import { notFound } from 'next/navigation'
import DoaContent from './doa-idclient'

const ONE_YEAR = 31536000

// React.cache() → generateMetadata dan DoaPage share 1 fetch call, bukan 2
const getDoaDetail = cache(async (id) => {
  const res = await fetch(`https://api.myquran.com/v2/doa/${id}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    next: { revalidate: ONE_YEAR }, // ganti no-store → cache statis
  })

  // 404 = doa memang tidak ada. Selain itu (429, 500, dll) = error sementara → lempar,
  // supaya hasil kosong TIDAK ikut tersimpan di cache selama setahun.
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`MyQuran API ${res.status} untuk doa ${id}`)

  const response = await res.json()
  return response.data || null
})

export async function generateMetadata({ params }) {
  const { id } = await params
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
      'bacaan doa arab latin',
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
export const revalidate = ONE_YEAR

export default async function DoaPage({ params }) {
  const { id } = await params
  const initialDoa = await getDoaDetail(id)

  if (!initialDoa) notFound()

  return <DoaContent initialData={initialDoa} doaId={id} />
}