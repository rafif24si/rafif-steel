// KOMENTAR DEMO: Komponen UI re-usable untuk dropdown pilihan (select). Menerima array 'options' untuk di-mapping secara dinamis menjadi daftar <option>.
export default function SelectField({ label, name, value, onChange, options = [] }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}