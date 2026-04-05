// components/ContactUsComponent.tsx
"use client";
import React, { useState } from "react";
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

  return (
    <section 
      className="w-full py-16 md:py-24 px-4 overflow-hidden"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Side - Content */}
          <div className="flex-1 space-y-5">
            {/* Section Label */}
            <div className="relative inline-block">
              <span 
                className="text-sm font-bold tracking-wider"
                style={{ color: theme.text }}
              >
                CONTACT US NOW
              </span>
              <div 
                className="absolute -bottom-1 left-0 w-full h-0.5"
                style={{ backgroundColor: theme.primary }}
              />
            </div>

            {/* Title */}
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ color: theme.text }}
            >
              Request a free <br />consultation with us
            </h2>

            {/* Description */}
            <p 
              className="text-base leading-relaxed max-w-md"
              style={{ color: theme.textSecondary }}
            >
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore aliqua.
            </p>

            {/* Policy Link */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-400 focus:ring-0 focus:ring-offset-0"
                  style={{ accentColor: theme.primary }}
                />
                <span 
                  className="text-sm transition-colors duration-200 group-hover:opacity-80"
                  style={{ color: theme.textSecondary }}
                >
                  You accept our policy →
                </span>
              </label>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label 
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
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
                  className="w-full px-0 py-2 border-0 border-b bg-transparent focus:outline-none focus:border-b-2 transition-all duration-200"
                  style={{
                    borderBottomColor: theme.border,
                    color: theme.text,
                    borderBottomWidth: "1px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = theme.primary;
                    e.currentTarget.style.borderBottomWidth = "2px";
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value) {
                      e.currentTarget.style.borderBottomColor = theme.border;
                      e.currentTarget.style.borderBottomWidth = "1px";
                    }
                  }}
                />
              </div>

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
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
                  className="w-full px-0 py-2 border-0 border-b bg-transparent focus:outline-none focus:border-b-2 transition-all duration-200"
                  style={{
                    borderBottomColor: theme.border,
                    color: theme.text,
                    borderBottomWidth: "1px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = theme.primary;
                    e.currentTarget.style.borderBottomWidth = "2px";
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value) {
                      e.currentTarget.style.borderBottomColor = theme.border;
                      e.currentTarget.style.borderBottomWidth = "1px";
                    }
                  }}
                />
              </div>

              {/* Message Field */}
              <div>
                <label 
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
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
                  className="w-full px-0 py-2 border-0 border-b bg-transparent focus:outline-none focus:border-b-2 transition-all duration-200 resize-none"
                  style={{
                    borderBottomColor: theme.border,
                    color: theme.text,
                    borderBottomWidth: "1px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = theme.primary;
                    e.currentTarget.style.borderBottomWidth = "2px";
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.value) {
                      e.currentTarget.style.borderBottomColor = theme.border;
                      e.currentTarget.style.borderBottomWidth = "1px";
                    }
                  }}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div 
                  className="p-3 rounded-md text-sm animate-shake"
                  style={{
                    backgroundColor: `${theme.error}15`,
                    color: theme.error,
                    border: `1px solid ${theme.error}30`,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div 
                  className="p-3 rounded-md text-sm animate-fadeIn"
                  style={{
                    backgroundColor: `${theme.success}15`,
                    color: theme.success,
                    border: `1px solid ${theme.success}30`,
                  }}
                >
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-none"
                style={{
                  backgroundColor: theme.primary,
                  color: "#ffffff",
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send message"
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