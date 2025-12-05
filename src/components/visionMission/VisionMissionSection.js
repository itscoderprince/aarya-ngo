export const metadata = {
  title: "Vision & Mission | Aarya Foundation",
  description:
    "Discover the vision and mission of Aarya Foundation. Our commitment to education, healthcare, and community empowerment drives every initiative.",
};

export default function MissionViewPage() {
  return (
    <section className="bg-[#011728] text-white py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Vision */}
        <div className="bg-white text-[#011728] rounded-2xl shadow-lg p-10 border-l-8 border-[#FFB70B]">
          <h2 className="text-3xl font-bold mb-4 text-[#011728]">Our Vision</h2>
          <p className="text-lg leading-relaxed">
            To create a society where every individual has access to education,
            healthcare, and equal opportunities. We envision a world of hope,
            dignity, and empowerment for all communities we serve.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-[#FFB70B] text-[#011728] rounded-2xl shadow-lg p-10 border-l-8 border-white">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            To empower underprivileged communities through sustainable programs
            in education, healthcare, and livelihood. By working together, we aim
            to build strong foundations that foster growth, equality, and
            positive change.
          </p>
        </div>

      </div>
    </section>
  );
}
