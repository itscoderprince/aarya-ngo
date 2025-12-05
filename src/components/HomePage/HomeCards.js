"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Sample Data with Indian-Context Images
const aboutData = [
  {
    // Indian School Children / Education (Rural Classroom)
    img: "education.jpg",
    text: "Education for All",
    link: "/education"
  },
  {
    // Indian Healthcare / Doctor with Rural Patient
    img: "healthcare.jpg",
    text: "Healthcare Support",
    link: "/healthcare"
  },
  {
    // Indian Women Group / Empowerment (Sari-clad women)
    img: "women.jpeg",
    text: "Women Empowerment",
    link: "/women-empowerment"
  },
  {
    // Indian Farmer in Field (Turban/Dhoti context)
    img: "agriculture.jpg",
    text: "Agriculture",
    link: "/agriculture"
  },
  {
    // Indian Child Eating / Nutrition (Mid-day meal context)
    img: "child.webp",
    text: "Child Nutrition",
    link: "/child-nutrition"
  },
];

export default function AboutSection() {
  const router = useRouter();

  const handleNavigation = (link) => {
    router.push(link);
  };

  const handleDonate = (e) => {
    e.stopPropagation();
    router.push("/donate-now");
  };

  return (
    <div className="w-full py-8 px-4">
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 text-[#022741]">
        About Our Mission
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {aboutData.map((item, idx) => (
          <motion.div
            key={idx}
            className="relative bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer"
            onClick={() => handleNavigation(item.link)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {/* Image Container - Using your original h-44 height */}
            <div className="relative h-44 w-full overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full"
              >
                {/* Using standard img tag for preview compatibility */}
                <img
                  src={item.img}
                  alt={item.text}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
                <span className="text-white text-base font-medium text-center px-2 transform group-hover:scale-105 transition-transform duration-300">
                  {item.text}
                </span>
              </div>

              {/* Heart Icon Button */}
              <button
                onClick={handleDonate}
                className="absolute bottom-2 right-2 text-white/90 hover:text-red-500 transition-all duration-300 hover:scale-110 z-10"
                title="Donate"
              >
                <Heart className="w-6 h-6 fill-current" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}