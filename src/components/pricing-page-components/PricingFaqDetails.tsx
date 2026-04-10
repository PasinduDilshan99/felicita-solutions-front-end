// components/pricing-page/PricingFaqDetails.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FAQService } from "@/services/faqService";
import { FAQ } from "@/types/faq-types";

const PricingFaqDetails = () => {
  const { theme } = useTheme();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await FAQService.fetchPricingFAQData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setFaqs(data);
          setFilteredFaqs(data);
          
          // Extract unique categories
          const uniqueCategories = ["all", ...new Set(data.map((f) => f.categoryName).filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          // Fallback data
          const fallbackFaqs: FAQ[] = [
            {
              faqId: 1,
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For enterprise plans, we also offer invoice payment with net-30 terms.",
              displayOrder: 1,
              categoryId: 1,
              categoryName: "Payment",
            },
            {
              faqId: 2,
              question: "Can I change my plan later?",
              answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle. If you upgrade mid-cycle, we'll prorate the difference.",
              displayOrder: 2,
              categoryId: 1,
              categoryName: "Billing",
            },
            {
              faqId: 3,
              question: "Is there a free trial available?",
              answer: "Yes, we offer a 14-day free trial on all plans. No credit card required. You'll get full access to all features during the trial period.",
              displayOrder: 3,
              categoryId: 1,
              categoryName: "Trial",
            },
            {
              faqId: 4,
              question: "Do you offer discounts for non-profits or educational institutions?",
              answer: "Yes, we offer a 30% discount for registered non-profits and educational institutions. Please contact our sales team with your documentation to verify eligibility.",
              displayOrder: 4,
              categoryId: 1,
              categoryName: "Discounts",
            },
            {
              faqId: 5,
              question: "Can I cancel my subscription at any time?",
              answer: "Yes, you can cancel your subscription at any time. There are no cancellation fees. Your service will continue until the end of your current billing period.",
              displayOrder: 5,
              categoryId: 1,
              categoryName: "Cancellation",
            },
            {
              faqId: 6,
              question: "Is there a setup fee?",
              answer: "No, there are no setup fees for any of our plans. You only pay the monthly or yearly subscription fee based on your chosen plan.",
              displayOrder: 6,
              categoryId: 1,
              categoryName: "Fees",
            },
            {
              faqId: 7,
              question: "What kind of support do you offer?",
              answer: "All plans include email support. Professional and Enterprise plans include priority chat support and phone support with 24/7 availability.",
              displayOrder: 7,
              categoryId: 2,
              categoryName: "Support",
            },
            {
              faqId: 8,
              question: "Is my data secure?",
              answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We are GDPR compliant and undergo regular security audits.",
              displayOrder: 8,
              categoryId: 2,
              categoryName: "Security",
            },
            {
              faqId: 9,
              question: "Do you offer API access?",
              answer: "Yes, all plans include API access. The Professional and Enterprise plans include higher rate limits and dedicated API support.",
              displayOrder: 9,
              categoryId: 2,
              categoryName: "API",
            },
            {
              faqId: 10,
              question: "Can I get a refund if I'm not satisfied?",
              answer: "We offer a 30-day money-back guarantee for annual plans. Monthly plans can be canceled at any time with no further charges.",
              displayOrder: 10,
              categoryId: 1,
              categoryName: "Refund",
            },
          ];
          setFaqs(fallbackFaqs);
          setFilteredFaqs(fallbackFaqs);
          const uniqueCategories = ["all", ...new Set(fallbackFaqs.map((f) => f.categoryName))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Filter FAQs based on category and search term
  useEffect(() => {
    let filtered = faqs;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.categoryName === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredFaqs(filtered);
    setOpenFaqId(null); // Close all when filtering
  }, [selectedCategory, searchTerm, faqs]);

  const toggleFaq = (faqId: number) => {
    setOpenFaqId(openFaqId === faqId ? null : faqId);
  };

  if (loading) {
    return <FaqSkeleton />;
  }

  if (error) {
    return <FaqError error={error} />;
  }

  return (
    <section className="w-full py-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.surface} 100%)`,
          }}
        />
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse-slow"
          style={{ backgroundColor: `${theme.primary}15` }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse-slower"
          style={{ backgroundColor: `${theme.secondary}15` }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span
              className="text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full animate-scale-in"
              style={{
                backgroundColor: `${theme.primary}10`,
                color: theme.primary,
                border: `1px solid ${theme.primary}20`,
              }}
            >
              Frequently Asked Questions
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-slide-in-up"
            style={{ color: theme.text }}
          >
            Got <span style={{ color: theme.primary }}>Questions?</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto animate-slide-in-up animation-delay-200"
            style={{ color: theme.textSecondary }}
          >
            Find answers to common questions about our pricing, features, and services
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6 animate-scale-in animation-delay-400"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 animate-fade-in-up animation-delay-600">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-xl outline-none transition-all duration-300 focus:ring-2"
              style={{
                backgroundColor: `${theme.surface}`,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.primary}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: theme.textSecondary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-up animation-delay-800">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize"
                style={{
                  backgroundColor:
                    selectedCategory === category
                      ? theme.primary
                      : `${theme.primary}10`,
                  color:
                    selectedCategory === category
                      ? "#ffffff"
                      : theme.primary,
                  border: `1px solid ${
                    selectedCategory === category
                      ? theme.primary
                      : `${theme.primary}20`
                  }`,
                  transform: selectedCategory === category ? "scale(1.05)" : "scale(1)",
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Accordion */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: `${theme.primary}10` }}
            >
              <svg className="w-8 h-8" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>No questions found</h3>
            <p style={{ color: theme.textSecondary }}>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up animation-delay-1000">
            {filteredFaqs.map((faq, index) => (
              <div
                key={faq.faqId}
                className="rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: openFaqId === faq.faqId ? `${theme.primary}05` : theme.background,
                  border: `1px solid ${
                    openFaqId === faq.faqId ? theme.primary : theme.border
                  }`,
                  boxShadow: openFaqId === faq.faqId
                    ? `0 10px 30px -12px ${theme.primary}30`
                    : "none",
                }}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFaq(faq.faqId)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 group transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {/* Category Badge */}
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${theme.primary}10`,
                          color: theme.primary,
                        }}
                      >
                        {faq.categoryName}
                      </span>
                    </div>
                    <h3
                      className="text-base md:text-lg font-semibold mt-2 transition-all duration-300"
                      style={{
                        color: openFaqId === faq.faqId ? theme.primary : theme.text,
                      }}
                    >
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: openFaqId === faq.faqId
                        ? `${theme.primary}20`
                        : `${theme.surface}`,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${
                        openFaqId === faq.faqId ? "rotate-180" : ""
                      }`}
                      style={{ color: openFaqId === faq.faqId ? theme.primary : theme.textSecondary }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Answer Panel */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaqId === faq.faqId ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-5 pb-5 pt-2">
                    <div
                      className="w-12 h-0.5 rounded-full mb-4"
                      style={{ backgroundColor: `${theme.primary}30` }}
                    />
                    <p
                      className="text-sm md:text-base leading-relaxed"
                      style={{ color: theme.textSecondary }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still Have Questions Section */}
        <div className="mt-16 text-center animate-fade-in-up animation-delay-1200">
          <div
            className="p-8 rounded-2xl"
            style={{
              backgroundColor: `${theme.primary}05`,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <h3 className="text-xl font-bold mb-3" style={{ color: theme.text }}>
              Still have questions?
            </h3>
            <p className="mb-6" style={{ color: theme.textSecondary }}>
              Can't find the answer you're looking for? Please chat with our friendly team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: theme.primary,
                  color: "#ffffff",
                }}
              >
                Contact Support
              </button>
              <button
                className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${theme.primary}10`,
                  color: theme.primary,
                  border: `1px solid ${theme.primary}20`,
                }}
              >
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 8s ease-in-out infinite; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const FaqSkeleton = () => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="h-6 w-32 mx-auto rounded-full mb-4 animate-pulse"
            style={{ backgroundColor: `${theme.primary}20` }}
          />
          <div
            className="h-10 w-64 mx-auto rounded-lg mb-4 animate-pulse"
            style={{ backgroundColor: `${theme.text}20` }}
          />
          <div
            className="h-5 w-96 mx-auto rounded-lg animate-pulse"
            style={{ backgroundColor: `${theme.textSecondary}20` }}
          />
        </div>
        <div className="max-w-md mx-auto mb-8">
          <div
            className="h-12 w-full rounded-xl animate-pulse"
            style={{ backgroundColor: `${theme.surface}` }}
          />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl animate-pulse"
              style={{ backgroundColor: theme.surface }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div
                    className="h-4 w-20 rounded mb-2"
                    style={{ backgroundColor: `${theme.primary}20` }}
                  />
                  <div
                    className="h-5 w-64 rounded"
                    style={{ backgroundColor: `${theme.text}20` }}
                  />
                </div>
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: `${theme.border}` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Error Component
const FaqError = ({ error }: { error: string | null }) => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 animate-bounce"
          style={{ backgroundColor: `${theme.error}10` }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke={theme.error}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text }}>
          {error || "Unable to Load FAQs"}
        </h3>
        <p style={{ color: theme.textSecondary }}>
          Please check your connection and try again
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: theme.primary,
            color: "#ffffff",
          }}
        >
          Retry
        </button>
      </div>
    </section>
  );
};

export default PricingFaqDetails;