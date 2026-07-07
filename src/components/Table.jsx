// KOMENTAR DEMO: Komponen UI re-usable untuk pembungkus Tabel (Table Wrapper) agar tampilan baris judul (thead) dan warna seragam di seluruh halaman data.
export default function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="border-b px-4 py-3 text-left text-sm font-semibold text-gray-700">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}