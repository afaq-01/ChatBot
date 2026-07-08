
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">MyLogo</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-gray-400">Home</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
          <a href="#" className="hover:text-gray-400">Services</a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <a href="#" className="block hover:text-gray-400">Home</a>
          <a href="#" className="block hover:text-gray-400">Contact</a>
          <a href="#" className="block hover:text-gray-400">Services</a>
        </div>
      )}
    </nav>
  );
}

// Hero Section Component with Typing + Animations
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Hero() {
  const text = "Hello, I am Abbas...";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const speed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(text.substring(0, index + 1));
        setIndex(index + 1);

        if (index + 1 === text.length) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        setDisplayText(text.substring(0, index - 1));
        setIndex(index - 1);

        if (index - 1 === 0) {
          setIsDeleting(false);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [index, isDeleting]);

  return (
    <section className="bg-black text-white min-h-screen w-full flex items-center">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 h-[60px]">
            {displayText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg mb-6">
            I am a passionate developer who loves building modern and responsive web applications.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-6 py-2 rounded-xl hover:bg-gray-200 transition"
          >
            Contact Me
          </motion.button>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center md:justify-end"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="h-[290px] w-[290px] md:h-[400px] md:w-[400px] shadow-xl shadow-pink-400 rounded-full overflow-hidden"
          >
            <img
              src="/abbas.jpeg"
              alt="Abbas"
              className="object-cover h-full w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
