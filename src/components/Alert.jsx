import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

// KOMENTAR DEMO: Komponen UI re-usable untuk menampilkan pesan Notifikasi/Alert (Peringatan, Sukses, Error) lengkap dengan ikon yang menyesuaikan otomatis.
export default function Alert({ type = "info", message, onClose }) {
  const config = {
    info: { icon: FaInfoCircle, bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
    success: { icon: FaCheckCircle, bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
    warning: { icon: FaExclamationTriangle, bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200" },
    error: { icon: FaTimesCircle, bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
  };
  const { icon: Icon, bg, text, border } = config[type];
  return (
    <div className={`${bg} ${text} border ${border} rounded-lg p-4 flex items-start justify-between`}>
      <div className="flex items-center gap-2"><Icon className="text-xl" /><span>{message}</span></div>
      {onClose && <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>}
    </div>
  );
}