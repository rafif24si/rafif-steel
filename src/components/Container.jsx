// KOMENTAR DEMO: Komponen UI re-usable untuk membatasi lebar konten (container) agar tata letak rapi di tengah layar.
export default function Container({ children, className = "" }) {
  return <div className={`container mx-auto px-4 py-8 ${className}`}>{children}</div>;
}