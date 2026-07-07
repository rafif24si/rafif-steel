import Button from "./Button";
// KOMENTAR DEMO: Komponen UI re-usable untuk bagian Banner Utama/Spanduk (Hero Section) di halaman depan, lengkap dengan tombol Call-to-Action (Mulai).
export default function HeroSection({ title, subtitle, ctaText, onCtaClick }) {
  return (
    <div className="relative bg-slate-900 text-white py-20 px-4 rounded-3xl overflow-hidden">
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black mb-4">{title}</h1>
        <p className="text-lg text-gray-200 mb-8">{subtitle}</p>
        <Button type="primary" onClick={onCtaClick} className="bg-white text-slate-900 hover:bg-gray-100">{ctaText || "Mulai"}</Button>
      </div>
    </div>
  );
}