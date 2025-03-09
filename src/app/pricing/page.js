"use client";

import { useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import SetmoreBooking from "@/components/SetmoreBooking";

export default function Pricing() {
  useEffect(() => {
    // Ensure Setmore script is loaded and initialized
    const loadSetmoreScript = () => {
      // Check if Setmore script is already loaded
      if (window.SetmoreAppointmentBooking) return;

      // Dynamically create script element
      const script = document.createElement("script");
      script.src = "https://www.setmore.com/app/js/embed.js";
      script.async = true;
      script.id = "setmore-embed-script";

      script.onload = () => {
        // Initialize Setmore widget
        if (window.SetmoreAppointmentBooking) {
          try {
            window.SetmoreAppointmentBooking.init({
              // Your Setmore account details
              // Typically includes apiKey or accountKey
              widgetType: "iframe",
              // Add any specific configuration options
            });
            console.log("Setmore widget initialized");
          } catch (error) {
            console.error("Error initializing Setmore widget:", error);
          }
        }
      };

      script.onerror = () => {
        console.error("Failed to load Setmore script");
      };

      document.body.appendChild(script);
    };

    // Load Setmore script when component mounts
    loadSetmoreScript();

    // Cleanup function
    return () => {
      const script = document.getElementById("setmore-embed-script");
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Reusable plan card component
  const PlanCard = ({
    title,
    price,
    duration,
    description,
    features,
    badgeText,
    badgeColor,
    planType,
    link,
  }) => (
    <div
      className={`
      bg-white dark:bg-gray-800 
      rounded-2xl 
      shadow-lg 
      overflow-hidden 
      transform 
      transition-all 
      hover:scale-105 
      hover:shadow-xl
      ${planType === "Private Lessons" ? "border-2 border-blue-500" : ""}
    `}
    >
      {planType === "Private Lessons" && (
        <div className="absolute inset-x-0 -top-px h-3 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      )}
      <div className="p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {badgeText && (
            <span
              className={`
              px-3 py-1 
              rounded-full 
              text-sm 
              font-medium
              ${badgeColor}
            `}
            >
              {badgeText}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-baseline">
          <span className="text-5xl font-extrabold text-foreground">
            ${price}
          </span>
          <span className="ml-1 text-xl text-gray-500">/ {duration}</span>
        </div>
        <p className="mt-6 text-gray-500 dark:text-gray-300">{description}</p>
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-3 text-gray-500 dark:text-gray-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <SetmoreBooking
            className="block w-full bg-blue-600 dark:bg-blue-500 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300"
            content={`Book ${title}`}
            link={link}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Setmore Embed Script */}
      <Script
        id="setmore-embed-script"
        src="https://www.setmore.com/app/js/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.SetmoreAppointmentBooking) {
            window.SetmoreAppointmentBooking.init({
              widgetType: "iframe",
            });
          }
        }}
      />

      {/* Header section */}
      <header className="pt-16 pb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Pricing Plans
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Choose the perfect plan to start your Japanese language journey with
          personalized lessons tailored to your learning goals.
        </p>
      </header>

      {/* Pricing cards section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Trial Lesson Card */}
          <PlanCard
            title="Trial Lesson"
            price={25}
            duration="45 min"
            description="Perfect for new students to experience our teaching method and assess your current level."
            features={[
              "Level assessment",
              "Personalized learning plan",
              "Q&A opportunity",
            ]}
            badgeText="First-time"
            badgeColor="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
            planType="Trial Lesson"
            link="https://nihongowithmoeno.setmore.com/services/b73466fd-27ee-4e25-a636-b612790524d5"
          />

          {/* Private Lessons Card */}
          <PlanCard
            title="Private Lessons"
            price={45}
            duration="hour"
            description="Comprehensive one-on-one lessons using 'Minna no Nihongo' for beginners (N5/N4 level)."
            features={[
              "Structured curriculum",
              "Grammar & vocabulary focus",
              "Homework & practice materials",
              "Progress tracking",
            ]}
            badgeText="Most Popular"
            badgeColor="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
            planType="Private Lessons"
            link="https://nihongowithmoeno.setmore.com/services/973589a8-1473-4d45-98a7-d18d416cbb16"
          />

          {/* Conversation Classes Card */}
          <PlanCard
            title="Conversation Classes"
            price={40}
            duration="hour"
            description="Flexible conversation practice for intermediate to advanced students (N3+ level)."
            features={[
              "Natural conversation practice",
              "Topic customization",
              "Real-world expressions",
              "Vocabulary expansion",
            ]}
            badgeText="Advanced"
            badgeColor="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
            planType="Conversation Classes"
            link="https://nihongowithmoeno.setmore.com/services/fd55350a-b434-47f8-9ba9-782304b8b3dd"
          />
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="flex justify-center">
            <Link
              href="/faq"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Have questions about our pricing? Check our FAQ
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-900 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            Need Custom Options?
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Looking for special arrangements or have questions about packages?
            Get in touch!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 py-3 px-8 rounded-lg font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
