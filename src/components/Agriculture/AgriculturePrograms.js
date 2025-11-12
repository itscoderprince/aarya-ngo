export default function AgriculturePrograms() {
  const programs = [
    {
      title: "Sustainable Farming Workshops",
      desc: "Hands-on training programs that teach organic, water-efficient, and climate-smart farming methods.",
    },
    {
      title: "AgriTech Support",
      desc: "Empowering farmers with digital tools, IoT-based soil sensors, and mobile apps for real-time crop management.",
    },
    {
      title: "Community Seed Banks",
      desc: "Preserving local biodiversity by establishing farmer-led seed saving and exchange programs.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-10">
          Our Key Agriculture Initiatives
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((prog, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                {prog.title}
              </h3>
              <p className="text-gray-600">{prog.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
