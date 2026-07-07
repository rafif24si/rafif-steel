// KOMENTAR DEMO: Komponen UI re-usable untuk input teks multi-baris (textarea). Biasanya digunakan untuk form alamat atau deskripsi produk.
export default function TextArea({ label, name, value, onChange, rows = 3, placeholder }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}