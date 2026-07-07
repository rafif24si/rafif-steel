// KOMENTAR DEMO: Komponen bagian paling bawah halaman (Footer). Berisi informasi hak cipta (copyright) dan link navigasi cepat.
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">HairCut.</h2>
        <p className="text-gray-400 text-sm mb-4">Barbershop Professional</p>
        <div className="flex justify-center gap-6 mb-4 text-sm">
          <a href="/" className="hover:text-gray-300">Beranda</a>
          <a href="/services" className="hover:text-gray-300">Layanan</a>
          <a href="/products" className="hover:text-gray-300">Produk</a>
        </div>
        <p className="text-gray-500 text-xs">© 2026 HairCut. All rights reserved.</p>
      </div>
    </footer>
  );
}