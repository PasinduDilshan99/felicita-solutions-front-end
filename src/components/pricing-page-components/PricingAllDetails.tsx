// components/pricing-page/PricingAllDetails.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { PricingService } from "@/services/pricingService";
import { PricingDetails } from "@/types/pricing-types";

const PricingAllDetails = () => {
  const { theme } = useTheme();
  const [pricingPlans, setPricingPlans] = useState<PricingDetails[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<PricingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const { data, error } = await PricingService.fetchPricingDetailsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setPricingPlans(data);
          setFilteredPlans(data);
          
          // Extract unique categories
          const uniqueCategories = ["all", ...new Set(data.map((p) => p.categoryName).filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          // Fallback data
          const fallbackPlans: PricingDetails[] = [
            {
              id: 1,
              name: "Starter",
              description: "Perfect for small businesses and startups",
              price: 49,
              billingCycle: "monthly",
              isPopular: false,
              categoryName: "Startup",
              features: [
                { title: "Users", value: "Up to 5 users", isAvailable: true },
                { title: "Storage", value: "10 GB storage", isAvailable: true },
                { title: "Support", value: "Email support", isAvailable: true },
                { title: "API Access", value: "Basic API access", isAvailable: true },
                { title: "Analytics", value: "Basic analytics", isAvailable: false },
                { title: "Custom Domain", value: "Custom domain", isAvailable: false },
              ],
              details: [
                { keyName: "Response Time", value: "24 hours" },
                { keyName: "Data Backup", value: "Weekly" },
                { keyName: "SSL Certificate", value: "Standard" },
              ],
              limits: [
                { name: "Projects", value: "3 projects" },
                { name: "API Calls", value: "10,000/month" },
                { name: "Team Members", value: "5 members" },
              ],
              discount: null,
            },
            {
              id: 2,
              name: "Professional",
              description: "Ideal for growing businesses",
              price: 99,
              billingCycle: "monthly",
              isPopular: true,
              categoryName: "Business",
              features: [
                { title: "Users", value: "Up to 20 users", isAvailable: true },
                { title: "Storage", value: "50 GB storage", isAvailable: true },
                { title: "Support", value: "Priority email & chat", isAvailable: true },
                { title: "API Access", value: "Full API access", isAvailable: true },
                { title: "Analytics", value: "Advanced analytics", isAvailable: true },
                { title: "Custom Domain", value: "Custom domain", isAvailable: true },
              ],
              details: [
                { keyName: "Response Time", value: "4 hours" },
                { keyName: "Data Backup", value: "Daily" },
                { keyName: "SSL Certificate", value: "Premium" },
                { keyName: "Dedicated IP", value: "Included" },
              ],
              limits: [
                { name: "Projects", value: "10 projects" },
                { name: "API Calls", value: "50,000/month" },
                { name: "Team Members", value: "20 members" },
              ],
              discount: {
                type: "percentage",
                value: 10,
                couponCode: "SAVE10",
                startDate: "2024-01-01",
                endDate: "2024-12-31",
              },
            },
            {
              id: 3,
              name: "Enterprise",
              description: "For large organizations",
              price: 199,
              billingCycle: "monthly",
              isPopular: false,
              categoryName: "Enterprise",
              features: [
                { title: "Users", value: "Unlimited users", isAvailable: true },
                { title: "Storage", value: "500 GB storage", isAvailable: true },
                { title: "Support", value: "24/7 dedicated support", isAvailable: true },
                { title: "API Access", value: "Full API access", isAvailable: true },
                { title: "Analytics", value: "Custom analytics", isAvailable: true },
                { title: "Custom Domain", value: "Custom domain", isAvailable: true },
              ],
              details: [
                { keyName: "Response Time", value: "1 hour" },
                { keyName: "Data Backup", value: "Real-time" },
                { keyName: "SSL Certificate", value: "Premium" },
                { keyName: "Dedicated IP", value: "Included" },
                { keyName: "SLA Guarantee", value: "99.9% uptime" },
              ],
              limits: [
                { name: "Projects", value: "Unlimited" },
                { name: "API Calls", value: "500,000/month" },
                { name: "Team Members", value: "Unlimited" },
              ],
              discount: {
                type: "fixed",
                value: 50,
                couponCode: "ENTERPRISE50",
                startDate: "2024-01-01",
                endDate: "2024-12-31",
              },
            },
          ];
          setPricingPlans(fallbackPlans);
          setFilteredPlans(fallbackPlans);
          const uniqueCategories = ["all", ...new Set(fallbackPlans.map((p) => p.categoryName))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Error fetching pricing data:", err);
        setError("Failed to load pricing data");
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  // Filter plans by category
  useEffect(() => {
    let filtered = pricingPlans;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((plan) => plan.categoryName === selectedCategory);
    }
    
    setFilteredPlans(filtered);
  }, [selectedCategory, pricingPlans]);

  // Calculate yearly price (with discount if applicable)
  const getYearlyPrice = (plan: PricingDetails) => {
    let yearlyPrice = plan.price * 12;
    
    if (plan.discount) {
      if (plan.discount.type === "percentage") {
        yearlyPrice = yearlyPrice * (1 - plan.discount.value / 100);
      } else if (plan.discount.type === "fixed") {
        yearlyPrice = yearlyPrice - plan.discount.value;
      }
    }
    
    return yearlyPrice;
  };

  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  // Check if discount is active
  const isDiscountActive = (plan: PricingDetails) => {
    if (!plan.discount) return false;
    const now = new Date();
    const startDate = new Date(plan.discount.startDate);
    const endDate = new Date(plan.discount.endDate);
    return now >= startDate && now <= endDate;
  };

  // Toggle plan expansion
  const toggleExpand = (planId: number) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  if (loading) {
    return <PricingDetailsSkeleton />;
  }

  if (error) {
    return <PricingDetailsError error={error} />;
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

      <div className="relative z-10 max-w-7xl mx-auto">
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
              Pricing Plans
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-in-up"
            style={{ color: theme.text }}
          >
            Choose Your <span style={{ color: theme.primary }}>Perfect Plan</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto animate-slide-in-up animation-delay-200"
            style={{ color: theme.textSecondary }}
          >
            Select the plan that best fits your needs. All plans include core features.
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6 animate-scale-in animation-delay-400"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8 animate-fade-in-up animation-delay-600">
          <div
            className="flex p-1 rounded-full"
            style={{
              backgroundColor: `${theme.surface}`,
              border: `1px solid ${theme.border}`,
            }}
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === "monthly" ? "shadow-md" : ""
              }`}
              style={{
                backgroundColor: billingCycle === "monthly" ? theme.primary : "transparent",
                color: billingCycle === "monthly" ? "#ffffff" : theme.textSecondary,
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingCycle === "yearly" ? "shadow-md" : ""
              }`}
              style={{
                backgroundColor: billingCycle === "yearly" ? theme.primary : "transparent",
                color: billingCycle === "yearly" ? "#ffffff" : theme.textSecondary,
              }}
            >
              Yearly Billing
              <span
                className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: billingCycle === "yearly" ? "rgba(255,255,255,0.2)" : `${theme.primary}20`,
                  color: billingCycle === "yearly" ? "#ffffff" : theme.primary,
                }}
              >
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up animation-delay-800">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize"
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

        {/* Pricing Cards Grid */}
        {filteredPlans.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ backgroundColor: `${theme.primary}10` }}
            >
              <svg className="w-10 h-10" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: theme.text }}>No pricing plans found</h3>
            <p style={{ color: theme.textSecondary }}>Please check back later for our pricing options</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPlans.map((plan, index) => {
              const displayPrice = billingCycle === "monthly" ? plan.price : getYearlyPrice(plan);
              const priceSuffix = billingCycle === "monthly" ? "/month" : "/year";
              const hasActiveDiscount = billingCycle === "yearly" && isDiscountActive(plan);
              
              return (
                <div
                  key={plan.id}
                  className="group pricing-card"
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className={`relative rounded-2xl transition-all duration-500 h-full ${
                      plan.isPopular ? "shadow-2xl" : ""
                    }`}
                    style={{
                      backgroundColor: theme.background,
                      border: `2px solid ${
                        plan.isPopular
                          ? theme.primary
                          : hoveredPlan === plan.id
                          ? theme.primary
                          : theme.border
                      }`,
                      transform:
                        hoveredPlan === plan.id
                          ? "translateY(-12px)"
                          : "translateY(0)",
                      boxShadow:
                        hoveredPlan === plan.id
                          ? `0 25px 50px -12px ${theme.primary}40`
                          : plan.isPopular
                          ? `0 20px 40px -12px ${theme.primary}30`
                          : "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Popular Badge */}
                    {plan.isPopular && (
                      <div
                        className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap z-10"
                        style={{ backgroundColor: theme.primary, color: "#ffffff" }}
                      >
                        Most Popular
                      </div>
                    )}

                    {/* Discount Badge */}
                    {hasActiveDiscount && plan.discount && (
                      <div
                        className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-semibold"
                        style={{ backgroundColor: "#10b981", color: "#ffffff" }}
                      >
                        {plan.discount.type === "percentage" 
                          ? `${plan.discount.value}% OFF` 
                          : `$${plan.discount.value} OFF`}
                      </div>
                    )}

                    {/* Plan Content */}
                    <div className="p-6">
                      {/* Plan Header */}
                      <div className="text-center mb-6">
                        <h3
                          className="text-xl font-bold mb-2"
                          style={{ color: theme.text }}
                        >
                          {plan.name}
                        </h3>
                        {plan.description && (
                          <p
                            className="text-sm"
                            style={{ color: theme.textSecondary }}
                          >
                            {plan.description}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          <span
                            className="text-4xl font-bold"
                            style={{ color: theme.primary }}
                          >
                            ${formatPrice(Math.round(displayPrice))}
                          </span>
                          <span className="text-sm" style={{ color: theme.textSecondary }}>
                            {priceSuffix}
                          </span>
                        </div>
                        {billingCycle === "yearly" && (
                          <p
                            className="text-xs mt-1"
                            style={{ color: theme.textSecondary }}
                          >
                            Billed annually (${formatPrice(Math.round(plan.price * 12))}/year)
                          </p>
                        )}
                        {hasActiveDiscount && plan.discount && (
                          <p
                            className="text-xs mt-1"
                            style={{ color: "#10b981" }}
                          >
                            {plan.discount.type === "percentage" 
                              ? `${plan.discount.value}% discount applied` 
                              : `$${plan.discount.value} discount applied`}
                            {plan.discount.couponCode && ` • Code: ${plan.discount.couponCode}`}
                          </p>
                        )}
                      </div>

                      {/* Features List */}
                      <div className="space-y-3 mb-6">
                        <h4 className="text-sm font-semibold mb-2" style={{ color: theme.text }}>
                          Key Features
                        </h4>
                        {plan.features.slice(0, 5).map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-sm"
                            style={{
                              opacity: feature.isAvailable ? 1 : 0.5,
                            }}
                          >
                            {feature.isAvailable ? (
                              <svg
                                className="w-5 h-5 flex-shrink-0"
                                fill="none"
                                stroke={theme.primary}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 flex-shrink-0"
                                fill="none"
                                stroke={theme.textSecondary}
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            <span
                              className="flex-1"
                              style={{
                                color: feature.isAvailable ? theme.textSecondary : theme.textSecondary,
                              }}
                            >
                              <span className="font-medium">{feature.title}:</span> {feature.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => toggleExpand(plan.id)}
                        className="w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: `${theme.primary}10`,
                          color: theme.primary,
                          border: `1px solid ${theme.primary}20`,
                        }}
                      >
                        {expandedPlan === plan.id ? "Show Less" : "Show More Details"}
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            expandedPlan === plan.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Expanded Details */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ${
                          expandedPlan === plan.id ? "max-h-[500px] mt-6" : "max-h-0"
                        }`}
                      >
                        {/* Additional Details */}
                        {plan.details && plan.details.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2" style={{ color: theme.text }}>
                              Additional Details
                            </h4>
                            <div className="space-y-2">
                              {plan.details.map((detail, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span style={{ color: theme.textSecondary }}>{detail.keyName}:</span>
                                  <span style={{ color: theme.text }} className="font-medium">
                                    {detail.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Limits */}
                        {plan.limits && plan.limits.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2" style={{ color: theme.text }}>
                              Plan Limits
                            </h4>
                            <div className="space-y-2">
                              {plan.limits.map((limit, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span style={{ color: theme.textSecondary }}>{limit.name}:</span>
                                  <span style={{ color: theme.text }} className="font-medium">
                                    {limit.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <button
                        className="w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: plan.isPopular ? theme.primary : `${theme.primary}10`,
                          color: plan.isPopular ? "#ffffff" : theme.primary,
                          border: plan.isPopular ? "none" : `1px solid ${theme.primary}20`,
                        }}
                      >
                        Get Started
                      </button>
                    </div>

                    {/* Decorative Line */}
                    <div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 rounded-full transition-all duration-300 group-hover:w-20"
                      style={{
                        backgroundColor:
                          hoveredPlan === plan.id
                            ? theme.primary
                            : theme.border,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Comparison Table Section */}
        <div className="mt-20 animate-fade-in-up animation-delay-1000">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: theme.text }}>
            Plan Comparison
          </h2>
          <div className="overflow-x-auto">
            <table
              className="w-full rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${theme.border}`,
              }}
            >
              <thead>
                <tr style={{ backgroundColor: `${theme.primary}10` }}>
                  <th className="p-4 text-left" style={{ color: theme.text }}>Feature</th>
                  {filteredPlans.map((plan) => (
                    <th key={plan.id} className="p-4 text-center" style={{ color: theme.text }}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPlans[0]?.features.map((feature, idx) => (
                  <tr key={idx} style={{ borderTop: `1px solid ${theme.border}` }}>
                    <td className="p-4 text-sm" style={{ color: theme.textSecondary }}>
                      {feature.title}
                    </td>
                    {filteredPlans.map((plan) => {
                      const planFeature = plan.features.find(f => f.title === feature.title);
                      return (
                        <td key={plan.id} className="p-4 text-center">
                          {planFeature?.isAvailable ? (
                            <svg className="w-5 h-5 mx-auto" fill="none" stroke={theme.primary} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 mx-auto" fill="none" stroke={theme.textSecondary} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center animate-fade-in-up animation-delay-1200">
          <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>
            Still have questions?
          </h2>
          <p className="mb-6" style={{ color: theme.textSecondary }}>
            Can't find the answer you're looking for? Please chat with our friendly team.
          </p>
          <button
            className="px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: `${theme.primary}10`,
              color: theme.primary,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            Contact Support
          </button>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
            style={{
              backgroundColor: `${theme.primary}05`,
              border: `1px solid ${theme.primary}20`,
            }}
          >
            <svg className="w-5 h-5" style={{ color: theme.primary }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm" style={{ color: theme.textSecondary }}>
              Trusted by 10,000+ businesses worldwide
            </span>
          </div>
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

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
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

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }

        .pricing-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

// Skeleton Loader
const PricingDetailsSkeleton = () => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="h-6 w-32 mx-auto rounded-full mb-4 animate-pulse"
            style={{ backgroundColor: `${theme.primary}20` }}
          />
          <div
            className="h-12 w-64 mx-auto rounded-lg mb-4 animate-pulse"
            style={{ backgroundColor: `${theme.text}20` }}
          />
          <div
            className="h-5 w-96 mx-auto rounded-lg animate-pulse"
            style={{ backgroundColor: `${theme.textSecondary}20` }}
          />
        </div>
        <div className="flex justify-center mb-8">
          <div
            className="h-10 w-64 rounded-full animate-pulse"
            style={{ backgroundColor: `${theme.surface}` }}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl animate-pulse overflow-hidden"
              style={{ backgroundColor: theme.surface }}
            >
              <div className="p-6">
                <div
                  className="h-6 w-32 mx-auto rounded mb-2"
                  style={{ backgroundColor: `${theme.text}20` }}
                />
                <div
                  className="h-4 w-40 mx-auto rounded mb-6"
                  style={{ backgroundColor: `${theme.textSecondary}20` }}
                />
                <div
                  className="h-10 w-32 mx-auto rounded mb-6"
                  style={{ backgroundColor: `${theme.primary}20` }}
                />
                <div className="space-y-3 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="h-4 w-full rounded"
                      style={{ backgroundColor: `${theme.textSecondary}20` }}
                    />
                  ))}
                </div>
                <div
                  className="h-10 w-full rounded-lg"
                  style={{ backgroundColor: `${theme.primary}20` }}
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
const PricingDetailsError = ({ error }: { error: string | null }) => {
  const { theme } = useTheme();

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 animate-bounce"
          style={{ backgroundColor: `${theme.error}10` }}
        >
          <svg
            className="w-10 h-10"
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
        <h3 className="text-2xl font-semibold mb-2" style={{ color: theme.text }}>
          {error || "Unable to Load Pricing Details"}
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

export default PricingAllDetails;