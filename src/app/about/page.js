// File: src/app/about/page.js
import Image from "next/image";
import irving from '@/../public/images/irving.jpg'
import moeno from '@/../public/images/moeno.jpg'


export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[200px] flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">About Us</h1>
      </section>

      {/* Classes Overview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            How Our Classes Work
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Our classes are modeled after the immersive Japanese classroom
            experience. Teachers speak only Japanese, ensuring students adapt
            quickly to listening and speaking in real-life situations. Lessons
            follow the proven structure of traditional Japanese teaching
            methods, enhanced with tailored, one-on-one support to meet your
            specific goals.
          </p>
          <p className="text-lg text-gray-700">
            Whether your goal is to travel to Japan and confidently navigate
            restaurants and shops or simply make Japanese friends, we’ll create
            a study plan that prepares you for success in real-world scenarios.
          </p>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            Who Are These Classes For?
          </h2>
          <p className="text-lg text-gray-700 text-center">
            Our lessons are designed for absolute beginners with busy schedules
            who want to learn the essentials before a trip to Japan or to start
            building friendships with Japanese speakers. We focus on practical,
            real-world language skills.
          </p>
        </div>
      </section>

      {/* About Moeno Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <Image
            src={moeno}
            alt="Moeno's profile photo"
            width={200}
            height={200}
            className="rounded-full mb-6"
          />
          <h2 className="text-3xl font-bold mb-6 text-black">Meet Moeno</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl">
            Moeno is a native Japanese speaker with a passion for teaching and
            sharing Japanese culture. She has always dreamed of creating content
            about Japan and the Japanese language. Currently studying English,
            Moeno aspires to become a professional translator in the future.
          </p>
        </div>
      </section>

      {/* About Irving Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <Image
            src={irving}
            alt="Irving's profile photo"
            width={200}
            height={200}
            className="rounded-full mb-6"
          />
          <h2 className="text-3xl font-bold mb-6 text-black">Meet Irving</h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl">
            Irving is a software engineer and content creator born in America to
            Dominican parents. Inspired by his love for Japanese city pop music,
            he began self-studying Japanese during the COVID pandemic. After
            four years of slow progress, Irving moved to Kyoto and immersed
            himself in Japanese classes for six months, learning more in that
            time than he had in years of self-study.
          </p>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-black">Why Learn with Us?</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            Together, Moeno and Irving combine a native speaker’s cultural and
            linguistic expertise with the experience of someone who has studied
            and lived in Japan. Moeno’s passion for teaching and Irving’s
            insights as a learner make them the perfect team to help you achieve
            your short-term goals, whether it’s preparing for a trip or building
            lasting connections with Japanese speakers.
          </p>
        </div>
      </section>
    </div>
  );
}
