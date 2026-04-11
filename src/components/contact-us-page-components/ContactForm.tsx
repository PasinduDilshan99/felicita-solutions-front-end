// components/contact-us-page/ContactForm.tsx
"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ContactUsService } from "@/services/contactUsService";
import { ContactUsRequest } from "@/types/contact-us-types";

interface FormErrors {
  name?: string;
  email?: string;
  contactNumber?: string;
  subject?: string;
  message?: string;
}

const ContactForm = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ContactUsRequest>({
    name: "",
    email: "",
    contactNumber: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Validate email format
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate phone number (basic validation)
  const validatePhone = (phone: string) => {
    const regex = /^[+]?[\d\s-]{8,}$/;
    return regex.test(phone);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Phone number is required";
    } else if (!validatePhone(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid phone number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const { data, error } = await ContactUsService.submitContactRequest(formData);
      
      if (error) {
        setSubmitStatus({
          type: "error",
          message: error || "Failed to send message. Please try again.",
        });
      } else if (data) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Thank you for contacting us! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
      // Clear success message after 5 seconds
      setTimeout(() => {
        if (submitStatus.type === "success") {
          setSubmitStatus({ type: null, message: "" });
        }
      }, 5000);
    }
  };

  // Get input styles
  const getInputStyles = (fieldName: string) => {
    const hasError = errors[fieldName as keyof FormErrors];
    const isFocused = focusedField === fieldName;
    
    return {
      backgroundColor: `${theme.surface}`,
      color: theme.text,
      border: `1px solid ${
        hasError
          ? theme.error || "#ef4444"
          : isFocused
          ? theme.primary
          : theme.border
      }`,
      boxShadow: isFocused ? `0 0 0 3px ${theme.primary}20` : "none",
      transition: "all 0.3s ease",
    };
  };

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

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-block mb-4">
            <span
              className="text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full animate-scale-in"
              style={{
                backgroundColor: `${theme.primary}10`,
                color: theme.primary,
                border: `1px solid ${theme.primary}20`,
              }}
            >
              Send a Message
            </span>
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-slide-in-up"
            style={{ color: theme.text }}
          >
            Get In <span style={{ color: theme.primary }}>Touch</span>
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto animate-slide-in-up animation-delay-200"
            style={{ color: theme.textSecondary }}
          >
            Have a question or project in mind? We'd love to hear from you!
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6 animate-scale-in animation-delay-400"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Contact Form */}
        <div
          className="rounded-2xl p-6 md:p-8 animate-fade-in-up animation-delay-600"
          style={{
            backgroundColor: `${theme.background}`,
            border: `1px solid ${theme.border}`,
            boxShadow: `0 25px 50px -12px ${theme.primary}15`,
          }}
        >
          {/* Success Message */}
          {submitStatus.type === "success" && (
            <div
              className="mb-6 p-4 rounded-xl animate-slide-down"
              style={{
                backgroundColor: `${theme.success}10`,
                border: `1px solid ${theme.success}`,
              }}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" style={{ color: theme.success }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ color: theme.success }}>{submitStatus.message}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus.type === "error" && (
            <div
              className="mb-6 p-4 rounded-xl animate-slide-down"
              style={{
                backgroundColor: `${theme.error}10`,
                border: `1px solid ${theme.error}`,
              }}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" style={{ color: theme.error }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p style={{ color: theme.error }}>{submitStatus.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                Full Name <span style={{ color: theme.error }}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                style={getInputStyles("name")}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs" style={{ color: theme.error }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text }}
                >
                  Email Address <span style={{ color: theme.error }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={getInputStyles("email")}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs" style={{ color: theme.error }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.text }}
                >
                  Phone Number <span style={{ color: theme.error }}>*</span>
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("contactNumber")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                  style={getInputStyles("contactNumber")}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-xs" style={{ color: theme.error }}>
                    {errors.contactNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Subject Field */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                Subject <span style={{ color: theme.error }}>*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedField("subject")}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                style={getInputStyles("subject")}
                placeholder="How can we help you?"
              />
              {errors.subject && (
                <p className="mt-1 text-xs" style={{ color: theme.error }}>
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-2"
                style={{ color: theme.text }}
              >
                Message <span style={{ color: theme.error }}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                rows={5}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 resize-none"
                style={getInputStyles("message")}
                placeholder="Tell us about your project or inquiry..."
              />
              {errors.message && (
                <p className="mt-1 text-xs" style={{ color: theme.error }}>
                  {errors.message}
                </p>
              )}
              <p
                className="mt-1 text-xs text-right"
                style={{ color: theme.textSecondary }}
              >
                {formData.message.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.primary,
                color: "#ffffff",
                boxShadow: `0 4px 15px ${theme.primary}40`,
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Message"
              )}
            </button>

            {/* Form Footer Note */}
            <p
              className="text-xs text-center mt-4"
              style={{ color: theme.textSecondary }}
            >
              By submitting this form, you agree to our{" "}
              <a href="/privacy-policy" style={{ color: theme.primary }} className="hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.2);
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

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
};

export default ContactForm;