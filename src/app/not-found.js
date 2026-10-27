import Navbar from "@/components/navbar";

export default function NotFound() {
  return (
    <>
    <main className="flex">
        <div>
            <Navbar />
        </div>

        <div className="flex justify-center items-center flex-col w-full p-4 pt-[72px] md:pt-0">
            <h1 className="text-3xl font-bold text-center mt-20">404 - Halaman Tidak Ditemukan</h1>
            <p className="text-center mt-4">Maaf, halaman yang Anda cari tidak ditemukan.</p>
        </div>
    </main>
    </>
  );
}