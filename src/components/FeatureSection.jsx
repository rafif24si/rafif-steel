import Card from "./Card";
// KOMENTAR DEMO: Komponen UI re-usable untuk menampilkan deretan keunggulan fitur/layanan dengan tata letak Grid (berjejer).
export default function FeatureSection({ features }) {
  return (
    <div className="py-12">
      <div className="text-center mb-10"><h2 className="text-3xl font-bold">Layanan Unggulan</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Card key={i} className="text-center hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}