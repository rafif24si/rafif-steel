import Card from "./Card";
import Badge from "./Badge";
import Button from "./Button";

// KOMENTAR DEMO: Komponen khusus untuk menampilkan data produk ke dalam bentuk Kartu. Menggabungkan penggunaan komponen Card, Badge, dan Button secara bersamaan.
export default function ProductCard({ image, title, category, price, description, onDetail }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-2xl" />
      <div className="p-4">
        <Badge type="primary">{category}</Badge>
        <h3 className="text-lg font-bold mt-2 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-black text-slate-800">Rp {price.toLocaleString()}</span>
          <Button type="primary" onClick={onDetail}>Detail</Button>
        </div>
      </div>
    </Card>
  );
}