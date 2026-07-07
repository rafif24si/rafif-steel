// KOMENTAR DEMO: Komponen UI re-usable untuk membungkus konten dalam bentuk Kartu (Card) dengan gaya bayangan (shadow) dan sudut membulat.
export default function Card({ children, className = "" }) {
  return <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-5 ${className}`}>{children}</div>;
}