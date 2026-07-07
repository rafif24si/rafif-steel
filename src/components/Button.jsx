// KOMENTAR DEMO: Komponen UI re-usable untuk Tombol (Button). Memiliki konfigurasi gaya (types) bawaan seperti primary, secondary, success, danger, agar tampilan tombol seragam di semua halaman.
export default function Button({ children, type = "primary", className = "", onClick, disabled = false }) {
  const types = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    dark: "bg-slate-800 hover:bg-slate-900 text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${types[type]} px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}