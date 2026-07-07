// KOMENTAR DEMO: Komponen UI re-usable untuk Label/Badge (biasanya digunakan untuk menampilkan status seperti Aktif/Tidak Aktif/Proses dengan warna berbeda).
export default function Badge({ children, type = "primary" }) {
  const types = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span className={`${types[type]} px-3 py-1 rounded-full text-xs font-semibold`}>
      {children}
    </span>
  );
}