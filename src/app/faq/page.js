// File: src/app/faq.js

export default function FAQ() {
  const faqs = [
    {
      question: "Who is this class for?",
      answer:
        "Our classes are designed for beginners who are just starting their journey into learning Japanese. Advanced learners can also join for conversational practice.",
    },
    {
      question: "Are the classes taught entirely in Japanese?",
      answer:
        "Yes, our classes are fully immersive and conducted entirely in Japanese to help students adapt to real-life language use.",
    },
    {
      question: "What if I don't understand something during the class?",
      answer:
        "Our teacher will use visual aids, examples, and repetition to ensure understanding. Beginners are encouraged to learn through context and practice.",
    },
    {
      question: "Do I need to buy any materials?",
      answer:
        "Yes, we recommend purchasing the 'Minna no Nihongo' textbook, as it will be the primary resource used in the lessons.",
    },
    {
      question: "Can I ask questions in English?",
      answer:
        "While the classes are conducted in Japanese, the teacher can provide limited explanations in English if absolutely necessary.",
    },
    {
      question: "How do I book a lesson?",
      answer:
        "Currently, we are accepting waitlist sign-ups. Once a slot becomes available, we will reach out to confirm your booking.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">
        Frequently Asked Questions
      </h1>
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-black">
              {faq.question}
            </h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <p className="text-red-600">
          Didn’t find your question? Contact us here.
        </p>
        {/* <a href="/contact">
          <a>
            Didn’t find your question? Contact us here.
          </a>
        </a> */}
      </div>
    </div>
  );
}
