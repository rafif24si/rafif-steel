// KOMENTAR DEMO: Komponen UI re-usable (dapat dipakai ulang) untuk menampilkan Avatar / Foto profil pengguna. Jika tidak ada foto (src), akan menampilkan inisial dari nama.
export default function Avatar({ name, src, size = "md" }) {
  const sizes = { sm: "w-6 h-6 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" };
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />;
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold`}>
      {name?.charAt(0).toUpperCase() || "?"}
    </div>
  );
}