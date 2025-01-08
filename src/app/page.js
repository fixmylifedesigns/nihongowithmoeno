// File: src/app/page.js
"use client"
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { useState } from "react";
import jsonp from "jsonp";
import banner from "@/../public/images/banner-large.jpg"

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    jsonp(
      `${process.env.NEXT_PUBLIC_MAILCHIMP_URL}&EMAIL=${email}`,
      { param: "c" },
      (_, data) => {
        const { msg } = data;
        alert(msg);
      }
    );
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={banner}
            alt="Japanese scenery overlooking Kyoto with a traditional pagoda"
            fill
            className="object-cover object-right md:object-center brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Start Learning Japanese Today
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-2xl">
            Tailored private lessons for beginners, taught by a native speaker in an immersive, authentic way.
          </p>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl">
            Currently, we are seeking to work one-on-one with one student. The selected student will receive a discounted rate.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button
              variant="primary"
              className="min-w-[200px]"
              onClick={handleModalToggle}
            >
              Join the Waitlist
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            Why Choose Our Classes?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Beginner-Focused Lessons",
                description:
                  "Our classes are designed for people just starting their Japanese journey, using immersive techniques to build confidence.",
              },
              {
                title: "Native Speaker Experience",
                description:
                  "Learn authentic Japanese from a native speaker who brings cultural insights to every lesson.",
              },
              {
                title: "Tailored to Your Goals",
                description: "Lessons are personalized to fit your pace and learning objectives, ensuring steady progress.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center  text-black"
              >
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Begin Your Japanese Journey?
          </h2>
          <p className="text-xl mb-8">
            Join our waitlist today and be the first to hear about new classes and opportunities.
          </p>
          <Button
            variant="secondary"
            className="min-w-[200px]"
            onClick={handleModalToggle}
          >
            Join the Waitlist
          </Button>
        </div>
      </section>

      {/* Modal for Waitlist */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-center text-black">Join the Waitlist</h3>
            <p className="text-gray-600 mb-4 text-center">
              Be the first to know when new classes become available!
            </p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-black">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
                placeholder="yourname@example.com"
                required
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
              >
                Submit
              </Button>
            </form>
            <button
              onClick={closeModal}
              className="mt-4 w-full text-center text-sm text-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
