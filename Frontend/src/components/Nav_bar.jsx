import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-black text-white item-center  w-full">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="text-xl font-bold flex">
                    <h1 className="text-pink-400">A_</h1>
                    <h1>BBAS</h1>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6">
                    <Link to='/' className="hover:text-gray-400">Home</Link>
                    <Link to='/Contect' className="hover:text-gray-400">Contect</Link>
                    <Link to='/services' className="hover:text-gray-400">Services</Link>
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
                <div className="md:hidden px-4 pb-4 space-y-2 duration-200">
                    <Link to="/" className="block hover:text-gray-400">Home</Link>
                    <Link to="/Services" className="block hover:text-gray-400">Services</Link>
                    <Link to="/Contect" className="block hover:text-gray-400">Contect</Link>
                </div>
            )}
        </nav>
    );
}
