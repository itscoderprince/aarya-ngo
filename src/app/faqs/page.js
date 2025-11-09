"use client"

import { useState } from "react"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "What is Prayas by Aarya Foundation?",
      answer:
        "Prayas by Aarya Foundation is a non-profit organization dedicated to empowering communities through education, healthcare, and women empowerment initiatives."
    },
    {
      question: "How can I get involved?",
      answer:
        "You can volunteer, donate, or partner with us to support various programs. Visit our Reach Us page to connect with us directly."
    },
    {
      question: "Where does Prayas operate?",
      answer:
        "We primarily operate across India, focusing on underserved communities in both rural and urban areas."
    },
    {
      question: "Are my donations tax deductible?",
      answer:
        "Yes, all donations to Prayas by Aarya Foundation are eligible for tax exemptions as per Indian law under Section 80G."
    },
    {
      question: "How can I contact the foundation?",
      answer:
        "You can reach us through our contact form on the Reach Us page, email us at contact@prayasfoundation.org, or call us at +91 98765 43210."
    }
  ]

  return (
    <>
   

      {/* Hero Section */}
      <section className="bg-[rgb(1,23,40)] text-white text-center py-16 px-6 lg:px-20">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Find answers to the most common questions about our work and mission.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 lg:px-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-6 border-b pb-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[rgb(1,23,40)]">
                  {faq.question}
                </h3>
                <span className="text-[rgb(255,183,11)] text-xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <p className="mt-3 text-gray-700">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

 
    </>
  )
}
