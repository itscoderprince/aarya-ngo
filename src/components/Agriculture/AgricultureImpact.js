export default function AgricultureImpact() {
  const stats = [
    { label: "Farmers Trained", value: "5,000+" },
    { label: "Villages Reached", value: "120+" },
    { label: "Hectares Improved", value: "8,000+" },
  ];

  return (
    <section className="py-16 bg-green-100 text-center">
      <h2 className="text-3xl font-bold text-green-700 mb-10">
        Our Impact on Rural Communities
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white shadow-lg rounded-2xl px-10 py-6">
            <h3 className="text-3xl font-bold text-green-800">{s.value}</h3>
            <p className="text-gray-700 mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
