// Services Page Component (with animations)
import { motion } from "framer-motion";

export function Services() {
  const services = [
    {
      title: "Web Development",
      desc: "Building responsive and modern websites using React and latest technologies."
    },
    {
      title: "UI/UX Design",
      desc: "Designing clean and user-friendly interfaces for better user experience."
    },
    {
      title: "Frontend Development",
      desc: "Creating fast and interactive user interfaces with modern frameworks."
    }
  ];

  return (
    <section className="bg-black text-white min-h-screen w-full flex items-center">
      <div className="max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold text-center mb-12"
        >
          My Services
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 p-6 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-3">
                {service.title}
              </h3>
              <p className="text-gray-400">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
