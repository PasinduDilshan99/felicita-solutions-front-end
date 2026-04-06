// components/ContactUsComponent.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ContactUsService } from "@/services/contactUsService";
import { ContactUsRequest } from "@/types/contact-us-types";

const ContactUsComponent = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ContactUsRequest>({
    name: "",
    email: "",
    contactNumber: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [animationState, setAnimationState] = useState({
    label: false,
    title: false,
    description: false,
    policy: false,
    form: false,
  });
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !sectionVisible) {
            setSectionVisible(true);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, [sectionVisible]);

  // Trigger animations when section becomes visible
  useEffect(() => {
    if (sectionVisible) {
      // Sequential animations for left side content
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, label: true }));
      }, 100);
      
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, title: true }));
      }, 300);
      
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, description: true }));
      }, 500);
      
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, policy: true }));
      }, 700);
      
      // Form animation from right side
      setTimeout(() => {
        setAnimationState(prev => ({ ...prev, form: true }));
      }, 200);
    }
  }, [sectionVisible]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!formData.message.trim()) {
      setError("Please enter your message");
      return;
    }
    if (!acceptedPolicy) {
      setError("Please accept our privacy policy");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await ContactUsService.submitContactRequest(formData);
      
      if (error) {
        setError(error);
      } else {
        setSuccess(data?.message || "Thank you! We'll get back to you soon.");
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          subject: "",
          message: "",
        });
        setAcceptedPolicy(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render content until section is visible
  if (!sectionVisible) {
    return (
      <section 
        ref={sectionRef}
        className="w-full py-16 md:py-24 px-4 relative min-h-[600px]"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center h-full min-h-[500px]">
          <div className="text-center">
            <div className="inline-block">
              <div 
                className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: `${theme.primary} transparent ${theme.primary} transparent` }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="w-full py-16 md:py-24 px-4 overflow-hidden relative"
      style={{ backgroundColor: theme.background }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 0% 50%, ${theme.primary}05 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Side - Content with Animations */}
          <div className="flex-1 space-y-5">
            {/* Section Label - Top to Bottom Animation */}
            <div className="relative inline-block">
              <span 
                className={`text-sm font-bold tracking-wider inline-block transform transition-all duration-700 ${
                  animationState.label
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
                }`}
                style={{ color: theme.text }}
              >
                CONTACT US NOW
              </span>
              <div 
                className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-700 delay-300 ${
                  animationState.label ? "w-full" : "w-0"
                }`}
                style={{ backgroundColor: theme.primary }}
              />
            </div>

            {/* Title - Top to Bottom Animation */}
            <h2 
              className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight transform transition-all duration-700 delay-200 ${
                animationState.title
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              }`}
              style={{ color: theme.text }}
            >
              Request a free <br />consultation with us
            </h2>

            {/* Description - Fade In Animation */}
            <p 
              className={`text-base leading-relaxed max-w-md transform transition-all duration-700 delay-400 ${
                animationState.description
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }`}
              style={{ color: theme.textSecondary }}
            >
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore aliqua.
            </p>

            {/* Policy Link - Bottom to Top Animation */}
            <div className={`pt-2 transform transition-all duration-700 delay-600 ${
              animationState.policy
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-400 focus:ring-0 focus:ring-offset-0 transition-all duration-200"
                  style={{ accentColor: theme.primary }}
                />
                <span 
                  className="text-sm transition-all duration-300 group-hover:translate-x-1 inline-block"
                  style={{ color: theme.textSecondary }}
                >
                  You accept our policy →
                </span>
              </label>
            </div>
          </div>

          {/* Right Side - Contact Form with Animation */}
          <div className={`flex-1 w-full transform transition-all duration-700 delay-200 ${
            animationState.form
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label 
                  htmlFor="name"
                  className="block text-sm font-medium mb-1 transition-all duration-200 group-focus-within:translate-x-1"
                  style={{ color: theme.text }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-0 py-2 border-0 border-b bg-transparent focus:outline-none focus:border-b-2 transition-all duration-300"
                  style={{
                    borderBottomColor: theme.border,
                    color: theme.text,
                    borderBottomWidth: "1px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = theme.primary;
                    e.currentTarget.style.borderBottomWidth = "2px";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value) {
                      e.currentTarget.style.borderBottomColor = theme.border;
                      e.currentTarget.style.borderBottomWidth = "1px";
                    }
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                />
              </div>

              {/* Email Field */}
              <div className="group">
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium mb-1 transition-all duration-200 group-focus-within:translate-x-1"
                  style={{ color: theme.text }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className="w-full px-0 py-2 border-0 border-b bg-transparent focus:outline-none focus:border-b-2 transition-all duration-300"
                  style={{
                    borderBottomColor: theme.border,
                    color: theme.text,
                    borderBottomWidth: "1px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = theme.primary;
                    e.currentTarget.style.borderBottomWidth = "2px";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value) {
                      e.currentTarget.style.borderBottomColor = theme.border;
                      e.currentTarget.style.borderBottomWidth = "1px";
                    }
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                />
              </div>

              {/* Message Field */}
              <div className="group">
                <label 
                  htmlFor="message"
                  className="block text-sm font-medium mb-1 transition-all duration-200 group-focus-within:translate-x-1"
                  style={{ color: theme.text }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={3}
                  className="w-full px-0 py-2 border-0 border-b bg-transparent focus:outline-none focus:border-b-2 transition-all duration-300 resize-none"
                  style={{
                    borderBottomColor: theme.border,
                    color: theme.text,
                    borderBottomWidth: "1px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = theme.primary;
                    e.currentTarget.style.borderBottomWidth = "2px";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value) {
                      e.currentTarget.style.borderBottomColor = theme.border;
                      e.currentTarget.style.borderBottomWidth = "1px";
                    }
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                />
              </div>

              {/* Error Message with Animation */}
              {error && (
                <div 
                  className="p-3 rounded-md text-sm animate-shake"
                  style={{
                    backgroundColor: `${theme.error}15`,
                    color: theme.error,
                    border: `1px solid ${theme.error}30`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Success Message with Animation */}
              {success && (
                <div 
                  className="p-3 rounded-md text-sm animate-fadeIn"
                  style={{
                    backgroundColor: `${theme.success}15`,
                    color: theme.success,
                    border: `1px solid ${theme.success}30`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {success}
                  </div>
                </div>
              )}

              {/* Submit Button with Hover Animation */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-none relative overflow-hidden group"
                style={{
                  backgroundColor: theme.primary,
                  color: "#ffffff",
                }}
              >
                {/* Button hover effect */}
                <span className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ backgroundColor: `${theme.primary}CC` }}
                />
                
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="relative z-10">Sending...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Send message</span>
                    <svg className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default ContactUsComponent;