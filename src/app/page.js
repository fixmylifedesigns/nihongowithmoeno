// File: src/app/page.js
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/api/placeholder/1920/600"
            alt="Japanese scenery"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Learn Japanese the Authentic Way
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-2xl">
            Immersive, engaging, and tailored private lessons with a native
            speaker
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/book">
              <Button variant="primary" className="min-w-[200px]">
                Book Your Trial Lesson
              </Button>
            </Link>
            <Link href="/classes">
              <Button variant="secondary" className="min-w-[200px]">
                View Classes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Personalized Learning",
                description:
                  "Lessons tailored to your goals and learning style",
              },
              {
                title: "Native Speaker",
                description:
                  "Learn authentic Japanese from a qualified instructor",
              },
              {
                title: "Flexible Schedule",
                description: "Book lessons at times that work for you",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
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
            Ready to Start Your Japanese Journey?
          </h2>
          <p className="text-xl mb-8">
            Book your trial lesson today and experience the difference
          </p>
          <Link href="/book">
            <Button variant="secondary" className="min-w-[200px]">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
