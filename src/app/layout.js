import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthContextProvider } from "../context/AuthContext";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata = {
  title: "Learn Japanese with Moeno | Private Lessons & Conversation Practice",
  description:
    "Master Japanese with Moeno, a native speaker! Private lessons for beginners, JLPT prep, and conversation practice. Learn Japanese online the authentic way!",
  keywords: [
    "Learn Japanese",
    "Japanese lessons",
    "Japanese tutor",
    "Japanese conversation practice",
    "JLPT preparation",
    "Online Japanese classes",
    "Japanese teacher",
    "Japanese with Moeno",
    "Study Japanese online",
    "Japanese language learning",
    "Japan",
    "Japanese Teacher",
  ],
  author: "Moeno | Nihongo with Moeno",
  openGraph: {
    title:
      "Learn Japanese with Moeno | Private Lessons & Conversation Practice",
    description:
      "Master Japanese with Moeno, a native speaker! Private lessons for beginners, JLPT prep, and conversation practice. Learn Japanese online the authentic way!",
    url: "https://nihongowithmoeno.com",
    type: "website",
    site_name: "Nihongo with Moeno",
    images: [
      {
        url: "https://nihongowithmoeno.com/images/nihongowithmoeno.png",
        width: 1200,
        height: 630,
        alt: "Learn Japanese with Moeno",
      },
    ],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Learn Japanese with Moeno | Private Lessons & Conversation Practice",
  //   description:
  //     "Master Japanese with Moeno, a native speaker! Private lessons for beginners, JLPT prep, and conversation practice. Learn Japanese online the authentic way!",
  //   site: "@yourtwitterhandle",
  //   image: "https://nihongowithmoeno.com/images/nihongowithmoeno.png",
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} min-h-screen flex flex-col bg-gray-900`}
        suppressHydrationWarning
      >
        <Navbar />

        <main className="flex-grow">
          <AuthContextProvider>{children}</AuthContextProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
