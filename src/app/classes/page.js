// File: src/app/classes.js

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";

export default function Classes() {
  const classes = [
    {
      title: "Beginner Single Class",
      description: "One-on-one private lesson tailored for N5/N4 beginners.",
      price: "$40",
      details: "1-hour class. Ideal for starting your Japanese journey.",
    },
    {
      title: "Beginner Monthly Package",
      description: "Four one-on-one lessons for N5/N4 beginners.",
      price: "$120",
      details: "4 classes per month. Perfect for consistent learning.",
    },
    {
      title: "Conversation Single Class",
      description: "One-on-one conversational practice for N3 and above.",
      price: "$30",
      details:
        "1-hour class. Improve fluency and real-world communication skills.",
    },
    {
      title: "Conversation Monthly Package",
      description: "Four conversational practice sessions for N3 and above.",
      price: "$100",
      details:
        "4 classes per month. Great for refining fluency and confidence.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Section */}
      <section className="relative h-[200px] flex items-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            We Aren’t Currently Taking Students
          </h1>
          <p className="text-lg">
            Join our waitlist to be notified when new slots become available!
          </p>
          {/* <Button
            variant="secondary"
            className="mt-4"
            onClick={() => alert("Waitlist form coming soon!")}
          >
            Join the Waitlist
          </Button> */}
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            Classes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {classes.map((cls, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-4 text-black">{cls.title}</h3>
                <p className="text-gray-600 mb-2">{cls.description}</p>
                <p className="text-gray-500 mb-4">{cls.details}</p>
                {/* <p className="text-xl font-bold text-red-600">{cls.price}</p> */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Learning Japanese?
          </h2>
          <p className="text-xl mb-8">
            Join our waitlist today and secure your spot for future classes.
          </p>
          {/* <Button
            variant="secondary"
            className="min-w-[200px]"
            onClick={() => alert("Waitlist form coming soon!")}
          >
            Join the Waitlist
          </Button> */}
        </div>
      </section>
    </div>
  );
}
