import React, { forwardRef } from 'react';

// KOMENTAR DEMO: Komponen UI re-usable untuk kolom input form. Menggunakan 'forwardRef' agar referensi DOM bisa diteruskan langsung ke elemen <input> (contohnya saat ingin memberi fokus otomatis).
const InputField = forwardRef(({ label, name, type = "text", value, onChange, placeholder, required = false }, ref) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={ref} 
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
});

export default InputField;