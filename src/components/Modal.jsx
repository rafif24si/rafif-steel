import { useEffect } from "react";
import Button from "./Button";
// KOMENTAR DEMO: Komponen Modal yang reusable (bisa dipakai berulang). Komponen ini mengatur tampilan popup dan memblokir scroll di belakang layar (body overflow hidden) saat sedang terbuka.
export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="p-5">{children}</div>
        <div className="p-5 pt-0 flex justify-end gap-2">
          <Button type="secondary" onClick={onClose}>Batal</Button>
          <Button type="primary" onClick={onClose}>Konfirmasi</Button>
        </div>
      </div>
    </div>
  );
}