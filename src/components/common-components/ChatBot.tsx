// components/home-page-components/ChatBot.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

interface Option {
  id: string;
  text: string;
  nextQuestion?: any;
  action?: string;
}

interface QuestionNode {
  id: string;
  question: string;
  options: Option[];
}

const ChatBot = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentNode, setCurrentNode] = useState<QuestionNode | null>(null);
  const [showOptions, setShowOptions] = useState(true);
  const [visibleMessages, setVisibleMessages] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Define the conversation tree first
  const conversationTree: { [key: string]: QuestionNode } = {
    start: {
      id: "start",
      question: "Hello! 👋 How can I help you today?",
      options: []
    },
    services: {
      id: "services",
      question: "We offer various services. What are you interested in?",
      options: []
    },
    webDev: {
      id: "web_dev",
      question: "Great! We specialize in modern web development. Which framework interests you?",
      options: []
    },
    mobileDev: {
      id: "mobile_dev",
      question: "For mobile apps, we work with these technologies:",
      options: []
    },
    cloud: {
      id: "cloud",
      question: "We're experts in all major cloud platforms:",
      options: []
    },
    aiMl: {
      id: "ai_ml",
      question: "Our AI/ML services include:",
      options: []
    },
    pricing: {
      id: "pricing",
      question: "We offer flexible pricing models. Which suits your needs?",
      options: []
    },
    support: {
      id: "support",
      question: "How can we assist you with support?",
      options: []
    },
    company: {
      id: "company",
      question: "What would you like to know about our company?",
      options: []
    }
  };

  conversationTree.start.options = [
    { id: "services", text: "💼 Tell me about your services", nextQuestion: conversationTree.services },
    { id: "pricing", text: "💰 Pricing & Plans", nextQuestion: conversationTree.pricing },
    { id: "support", text: "🛠️ Need Support", nextQuestion: conversationTree.support },
    { id: "company", text: "🏢 About the Company", nextQuestion: conversationTree.company }
  ];

  conversationTree.services.options = [
    { id: "web_dev", text: "💻 Web Development", nextQuestion: conversationTree.webDev },
    { id: "mobile_dev", text: "📱 Mobile App Development", nextQuestion: conversationTree.mobileDev },
    { id: "cloud", text: "☁️ Cloud Solutions", nextQuestion: conversationTree.cloud },
    { id: "ai_ml", text: "🤖 AI & Machine Learning", nextQuestion: conversationTree.aiMl },
    { id: "back", text: "◀️ Back to Main Menu", nextQuestion: conversationTree.start }
  ];

  conversationTree.webDev.options = [
    { id: "react", text: "⚛️ React / Next.js", action: "React is perfect for dynamic SPAs and SEO-friendly applications with Next.js. Our React experts can build fast, scalable web applications with modern best practices." },
    { id: "vue", text: "🟢 Vue.js / Nuxt", action: "Vue offers progressive framework with excellent performance and easy learning curve. We use Vue for lightweight, flexible applications." },
    { id: "angular", text: "🔴 Angular", action: "Angular is enterprise-ready with comprehensive features and TypeScript support. Perfect for large-scale business applications." },
    { id: "back_services", text: "◀️ Back to Services", nextQuestion: conversationTree.services }
  ];

  conversationTree.mobileDev.options = [
    { id: "react_native", text: "📱 React Native", action: "React Native allows cross-platform development with native performance and code reuse. Build iOS and Android apps from a single codebase." },
    { id: "flutter", text: "🦋 Flutter", action: "Flutter offers beautiful UIs with Google's UI toolkit for natively compiled apps. Great for stunning designs and smooth animations." },
    { id: "native", text: "🍎 Swift / Kotlin", action: "Native development provides best performance and platform-specific features. Ideal for high-performance apps requiring native capabilities." },
    { id: "back_services", text: "◀️ Back to Services", nextQuestion: conversationTree.services }
  ];

  conversationTree.cloud.options = [
    { id: "aws", text: "☁️ AWS", action: "AWS offers comprehensive cloud services with global infrastructure and reliability. We're AWS certified partners with 100+ successful migrations." },
    { id: "azure", text: "🔵 Microsoft Azure", action: "Azure provides seamless integration with Microsoft ecosystem and enterprise features. Perfect for .NET applications and Windows workloads." },
    { id: "gcp", text: "🟢 Google Cloud", action: "GCP excels in data analytics, AI/ML capabilities, and competitive pricing. Great for data-intensive applications and startups." },
    { id: "back_services", text: "◀️ Back to Services", nextQuestion: conversationTree.services }
  ];

  conversationTree.aiMl.options = [
    { id: "nlp", text: "🗣️ NLP & Chatbots", action: "We build intelligent chatbots and NLP solutions for customer service automation, sentiment analysis, and language processing." },
    { id: "vision", text: "👁️ Computer Vision", action: "Computer vision solutions for image recognition, object detection, facial recognition, and visual inspection systems." },
    { id: "predictive", text: "📊 Predictive Analytics", action: "Predictive models for business forecasting, risk assessment, customer behavior prediction, and optimization." },
    { id: "back_services", text: "◀️ Back to Services", nextQuestion: conversationTree.services }
  ];

  conversationTree.pricing.options = [
    { id: "fixed", text: "📦 Fixed Price", action: "Fixed price is ideal for well-defined projects with clear requirements. We provide a one-time quote based on your scope. Perfect for small to medium projects with specific deliverables." },
    { id: "hourly", text: "⏱️ Time & Material", action: "Time & Material offers flexibility for evolving projects. You pay for actual hours worked at our standard rates ($50-150/hour depending on expertise). Great for long-term partnerships." },
    { id: "dedicated", text: "👥 Dedicated Team", action: "Dedicated team model provides full-time developers working exclusively on your project with monthly billing. Starting from $5,000/month per developer. Ideal for ongoing development." },
    { id: "consultation", text: "🎯 Free Consultation", action: "Great! Would you like to schedule a free consultation call to discuss your project and get a custom quote? Please provide your email and preferred time, and our sales team will contact you within 24 hours." },
    { id: "back", text: "◀️ Back to Main Menu", nextQuestion: conversationTree.start }
  ];

  conversationTree.support.options = [
    { id: "technical", text: "🔧 Technical Support", action: "Our technical support team is available 24/7. You can reach us at:\n\n📧 Email: support@yourcompany.com\n📞 Phone: +1 (555) 123-4567\n💬 Live chat: Available on our website\n⏱️ Response time: Within 1 hour" },
    { id: "billing", text: "💰 Billing Questions", action: "For billing inquiries, please contact our finance team:\n\n📧 Email: billing@yourcompany.com\n📞 Phone: +1 (555) 123-4568\n🕒 Hours: Mon-Fri, 9 AM - 6 PM EST\n⏱️ Response time: Within 4 hours" },
    { id: "account", text: "👤 Account Management", action: "Our account managers are here to help! Please email accounts@yourcompany.com with your account details and we'll respond within 2 hours. For urgent issues, call +1 (555) 123-4569." },
    { id: "back", text: "◀️ Back to Main Menu", nextQuestion: conversationTree.start }
  ];

  conversationTree.company.options = [
    { id: "about", text: "📖 About Us", action: "We're a leading software development company founded in 2015. We've delivered 500+ successful projects to clients worldwide with a team of 150+ experts. Our mission is to transform ideas into innovative digital solutions." },
    { id: "clients", text: "🏆 Our Clients", action: "We've worked with 200+ clients including Fortune 500 companies, innovative startups, and government organizations across 15+ countries. Our client retention rate is 95%." },
    { id: "careers", text: "💼 Careers", action: "We're hiring! Current openings:\n\n• Senior Software Engineer\n• UI/UX Designer\n• Project Manager\n• Cloud Architect\n• Sales Executive\n\nVisit careers.yourcompany.com to apply or send your resume to careers@yourcompany.com" },
    { id: "contact", text: "📞 Contact Info", action: "📍 Address: 123 Business Street, Tech City, TC 12345\n\n📧 Email: info@yourcompany.com\n📞 Phone: +1 (555) 123-4567\n🌐 Website: www.yourcompany.com\n\n📱 Social Media:\n• LinkedIn: /company/yourcompany\n• Twitter: @yourcompany" },
    { id: "back", text: "◀️ Back to Main Menu", nextQuestion: conversationTree.start }
  ];

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatWindowRef.current &&
        buttonRef.current &&
        !chatWindowRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 280);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  // Initial bot message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getTimeBasedGreeting();
      setTimeout(() => {
        addBotMessage(`${greeting}! 👋 Welcome to our support assistant. I'm here to help you navigate through our services and answer your questions.`);
        setTimeout(() => {
          setCurrentNode(conversationTree.start);
          addBotMessage(conversationTree.start.question);
          setShowOptions(true);
        }, 900);
      }, 400);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const newId = Date.now();
      setMessages(prev => [...prev, {
        id: newId,
        text,
        sender: "bot",
        timestamp: new Date(),
      }]);
      setIsTyping(false);
      // Trigger entrance animation
      setTimeout(() => {
        setVisibleMessages(prev => new Set([...prev, newId]));
      }, 30);
    }, 350);
  };

  const addUserMessage = (text: string) => {
    const newId = Date.now();
    setMessages(prev => [...prev, {
      id: newId,
      text,
      sender: "user",
      timestamp: new Date(),
    }]);
    setTimeout(() => {
      setVisibleMessages(prev => new Set([...prev, newId]));
    }, 30);
  };

  const handleOptionClick = (option: Option) => {
    addUserMessage(option.text);
    setShowOptions(false);

    if (option.action) {
      setTimeout(() => {
        addBotMessage(option.action!);
        setTimeout(() => {
          const continueOption: Option = {
            id: "continue",
            text: "✅ Continue to Main Menu",
            nextQuestion: conversationTree.start
          };
          setCurrentNode({
            id: "continue",
            question: "Would you like to explore other services or ask something else?",
            options: [continueOption]
          });
          addBotMessage("Would you like to explore other services or ask something else?");
          setShowOptions(true);
        }, 1600);
      }, 500);
    } else if (option.nextQuestion) {
      setTimeout(() => {
        setCurrentNode(option.nextQuestion!);
        addBotMessage(option.nextQuestion!.question);
        setShowOptions(true);
      }, 500);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="chat-fab"
        style={{
          backgroundColor: theme.primary,
          boxShadow: `0 8px 32px ${theme.primary}55`,
        }}
        aria-label="Toggle chat"
      >
        <span className={`chat-fab-icon ${isOpen ? "chat-fab-icon--close" : "chat-fab-icon--open"}`}>
          {isOpen ? (
            <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </span>
        {!isOpen && <span className="chat-fab-badge" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className={`chat-window ${isClosing ? "chat-window--closing" : "chat-window--open"}`}
          style={{
            backgroundColor: theme.background,
            border: `1px solid ${theme.border}`,
          }}
        >
          {/* Header */}
          <div className="chat-header" style={{ backgroundColor: theme.primary }}>
            <div className="chat-header-left">
              <div className="chat-avatar">
                <svg className="chat-avatar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="chat-avatar-status" />
              </div>
              <div>
                <h3 className="chat-title">AI Assistant</h3>
                <p className="chat-subtitle">Online • Guided Conversation</p>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={handleClose}
              aria-label="Close chat"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message-row ${message.sender === "user" ? "chat-message-row--user" : "chat-message-row--bot"} ${visibleMessages.has(message.id) ? "chat-message-row--visible" : ""}`}
              >
                <div
                  className={`chat-bubble ${message.sender === "user" ? "chat-bubble--user" : "chat-bubble--bot"}`}
                  style={{
                    backgroundColor: message.sender === "user" ? theme.primary : theme.surface,
                    color: message.sender === "user" ? "#ffffff" : theme.text,
                  }}
                >
                  <p className="chat-bubble-text">{message.text}</p>
                  <span
                    className="chat-bubble-time"
                    style={{ color: message.sender === "user" ? "rgba(255,255,255,0.65)" : theme.textSecondary }}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="chat-message-row chat-message-row--bot chat-message-row--visible">
                <div className="chat-bubble chat-bubble--bot chat-bubble--typing" style={{ backgroundColor: theme.surface }}>
                  <span className="typing-dot" style={{ backgroundColor: theme.textSecondary }} />
                  <span className="typing-dot" style={{ backgroundColor: theme.textSecondary }} />
                  <span className="typing-dot" style={{ backgroundColor: theme.textSecondary }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Options Panel */}
          {showOptions && currentNode && (
            <div className="chat-options">
              <p className="chat-options-label" style={{ color: theme.textSecondary }}>
                Choose an option:
              </p>
              <div className="chat-options-list">
                {currentNode.options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="chat-option-btn"
                    style={{
                      backgroundColor: `${theme.primary}09`,
                      border: `1px solid ${theme.primary}22`,
                      animationDelay: `${index * 60}ms`,
                    }}
                  >
                    <div
                      className="chat-option-icon"
                      style={{
                        backgroundColor: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      {option.text.includes("◀️") ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      ) : option.text.includes("✅") ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <span className="chat-option-text" style={{ color: theme.text }}>
                      {option.text}
                    </span>
                    <svg
                      className="chat-option-arrow"
                      style={{ color: theme.primary }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="chat-footer" style={{ borderColor: theme.border }}>
            <p className="chat-footer-text" style={{ color: theme.textSecondary }}>
              Powered by AI Assistant • Guided conversation
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ── FAB Button ── */
        .chat-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 50;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.25s ease;
          outline: none;
        }
        .chat-fab:hover {
          transform: scale(1.12) translateY(-2px);
        }
        .chat-fab:active {
          transform: scale(0.96);
          transition-duration: 0.1s;
        }

        .chat-fab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.2s ease;
        }
        .chat-fab-icon--open {
          transform: rotate(0deg) scale(1);
          opacity: 1;
        }
        .chat-fab-icon--close {
          transform: rotate(90deg) scale(1);
          opacity: 1;
        }
        .icon-svg {
          width: 24px;
          height: 24px;
          color: white;
        }

        .chat-fab-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 13px;
          height: 13px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
          animation: badge-pulse 2s ease-in-out infinite;
        }

        /* ── Chat Window ── */
        .chat-window {
          position: fixed;
          bottom: 96px;
          right: 24px;
          z-index: 50;
          width: 420px;
          height: 620px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform-origin: bottom right;
          will-change: transform, opacity;
        }
        .chat-window--open {
          animation: window-enter 0.35s cubic-bezier(0.34, 1.45, 0.64, 1) forwards;
        }
        .chat-window--closing {
          animation: window-exit 0.28s cubic-bezier(0.55, 0, 1, 0.45) forwards;
        }

        /* ── Header ── */
        .chat-header {
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .chat-avatar-icon {
          width: 22px;
          height: 22px;
          color: white;
        }
        .chat-avatar-status {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 11px;
          height: 11px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid white;
          animation: badge-pulse 2s ease-in-out infinite;
        }
        .chat-title {
          font-size: 14px;
          font-weight: 600;
          color: white;
          margin: 0;
          line-height: 1.2;
        }
        .chat-subtitle {
          font-size: 11px;
          color: rgba(255,255,255,0.75);
          margin: 2px 0 0;
        }
        .chat-close-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 8px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          transition: background 0.18s ease, transform 0.18s ease, color 0.18s ease;
          outline: none;
          flex-shrink: 0;
        }
        .chat-close-btn:hover {
          background: rgba(255,255,255,0.28);
          color: white;
          transform: scale(1.08);
        }
        .chat-close-btn:active {
          transform: scale(0.93);
        }

        /* ── Messages ── */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scroll-behavior: smooth;
        }
        .chat-messages::-webkit-scrollbar {
          width: 4px;
        }
        .chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-messages::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.12);
          border-radius: 4px;
        }

        .chat-message-row {
          display: flex;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
        }
        .chat-message-row--bot {
          justify-content: flex-start;
          transform: translateX(-14px);
        }
        .chat-message-row--user {
          justify-content: flex-end;
          transform: translateX(14px);
        }
        .chat-message-row--visible {
          opacity: 1;
          transform: translateX(0);
        }

        .chat-bubble {
          max-width: 82%;
          border-radius: 18px;
          padding: 10px 14px;
        }
        .chat-bubble--bot {
          border-bottom-left-radius: 5px;
        }
        .chat-bubble--user {
          border-bottom-right-radius: 5px;
        }
        .chat-bubble-text {
          font-size: 13.5px;
          line-height: 1.55;
          white-space: pre-wrap;
          margin: 0;
        }
        .chat-bubble-time {
          font-size: 10.5px;
          display: block;
          margin-top: 4px;
          opacity: 0.7;
        }

        /* Typing Indicator */
        .chat-bubble--typing {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          animation: typing-bounce 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(1) { animation-delay: 0ms; }
        .typing-dot:nth-child(2) { animation-delay: 160ms; }
        .typing-dot:nth-child(3) { animation-delay: 320ms; }

        /* ── Options Panel ── */
        .chat-options {
          padding: 0 14px 12px;
          flex-shrink: 0;
        }
        .chat-options-label {
          font-size: 11px;
          font-weight: 500;
          margin: 0 0 8px 2px;
          letter-spacing: 0.02em;
        }
        .chat-options-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          max-height: 220px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .chat-options-list::-webkit-scrollbar {
          width: 3px;
        }
        .chat-options-list::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 3px;
        }

        .chat-option-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background-color 0.18s ease,
                      box-shadow 0.2s ease,
                      border-color 0.18s ease;
          outline: none;
          animation: option-slide-in 0.32s ease both;
        }
        .chat-option-btn:hover {
          transform: translateX(3px) scale(1.015);
          box-shadow: 0 3px 12px rgba(0,0,0,0.08);
        }
        .chat-option-btn:active {
          transform: scale(0.97) translateX(1px);
          transition-duration: 0.1s;
        }

        .chat-option-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .chat-option-btn:hover .chat-option-icon {
          transform: scale(1.12);
        }

        .chat-option-text {
          font-size: 13px;
          font-weight: 500;
          flex: 1;
          line-height: 1.3;
        }

        .chat-option-arrow {
          flex-shrink: 0;
          opacity: 0.6;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.18s ease;
        }
        .chat-option-btn:hover .chat-option-arrow {
          transform: translateX(4px);
          opacity: 1;
        }

        /* ── Footer ── */
        .chat-footer {
          padding: 10px 16px;
          text-align: center;
          border-top: 1px solid;
          flex-shrink: 0;
        }
        .chat-footer-text {
          font-size: 11px;
          margin: 0;
          opacity: 0.7;
        }

        /* ── Keyframes ── */
        @keyframes window-enter {
          0% {
            opacity: 0;
            transform: scale(0.88) translateY(18px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes window-exit {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(0.9) translateY(14px);
          }
        }

        @keyframes badge-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.88); }
        }

        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }

        @keyframes option-slide-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot;