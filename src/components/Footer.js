// File: src/components/Footer.js
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-lg font-bold mb-4">
              Nihongo with Moeno
            </h3>
            <p className="mb-4">
              Learn Japanese through immersive, one-on-one lessons with a native
              speaker. Perfect for beginners and advanced learners alike.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/classes" className="hover:text-white">
                  Classes
                </Link>
              </li>
              <li>
                <Link href="/material" className="hover:text-white">
                  Learning Material
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Teacher Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>Email: nihongowithmoeno@gmail.com</li>
              <li>
                <div className="flex space-x-4 mt-4">
                  <a href="https://www.tiktok.com/@nihongowithmoeno" className="hover:text-white">
                    Tiktok
                  </a>
                  <a href="https://www.instagram.com/nihongowithmoeno" className="hover:text-white">
                    Instagram
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} Nihongo with Moeno. All rights reserved.</p>
          <p className="mt-2">
            Website made by <a href="https://www.minnastudy.com" className="text-blue-400 hover:underline">minnastudy.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
