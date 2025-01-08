import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata = {
  title: "Japanese with Moeno - Learn Japanese the Authentic Way",
  description:
    "Learn Japanese through immersive, one-on-one lessons with a native speaker. Private lessons for beginners and conversation practice for advanced learners.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} min-h-screen flex flex-col bg-gray-900`} suppressHydrationWarning>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
