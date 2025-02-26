// File: src/components/Navbar.js
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/../public/images/nihongowithmoeno.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/classes", label: "Classes" },
    { href: "http://shop.nihongowithmoeno.com", label: "Shop" },
    { href: "/faq", label: "FAQ" },

    // { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src={logo}
                alt="Nihongo with Moeno Logo"
                // width={150} // or an appropriate width
                height={60} // matches max-height in CSS
                priority
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium"
              >
                {label}
              </Link>
            ))}
            {/* <Link
              href="/book"
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
            >
              Book a Lesson
            </Link> */}
          </div>

          {/* Mobile and Tablet menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-red-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile and Tablet menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {/* <Link
              href="/book"
              className="block px-3 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Lesson
            </Link> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
