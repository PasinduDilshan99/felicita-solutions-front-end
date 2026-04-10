// components/pricing-page/PricingPlanComparison.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { PricingService } from "@/services/pricingService";
import { PricingDetails } from "@/types/pricing-types";

interface SelectedPlan {
  id: number;
  name: string;
  data: PricingDetails;
}

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
      { title: "24/7 Support", value: "24/7 support", isAvailable: false },
      { title: "Dedicated IP", value: "Dedicated IP", isAvailable: false },
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
      { title: "24/7 Support", value: "24/7 support", isAvailable: true },
      { title: "Dedicated IP", value: "Dedicated IP", isAvailable: false },
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
      { title: "24/7 Support", value: "24/7 support", isAvailable: true },
      { title: "Dedicated IP", value: "Dedicated IP", isAvailable: true },
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
  {
    id: 4,
    name: "Ultimate",
    description: "Maximum performance and features",
    price: 299,
    billingCycle: "monthly",
    isPopular: false,
    categoryName: "Enterprise",
    features: [
      { title: "Users", value: "Unlimited users", isAvailable: true },
      { title: "Storage", value: "1 TB storage", isAvailable: true },
      { title: "Support", value: "24/7 priority support", isAvailable: true },
      { title: "API Access", value: "Full API access", isAvailable: true },
      { title: "Analytics", value: "Custom analytics", isAvailable: true },
      { title: "Custom Domain", value: "Custom domain", isAvailable: true },
      { title: "24/7 Support", value: "24/7 support", isAvailable: true },
      { title: "Dedicated IP", value: "Dedicated IP", isAvailable: true },
    ],
    details: [
      { keyName: "Response Time", value: "30 minutes" },
      { keyName: "Data Backup", value: "Real-time" },
      { keyName: "SSL Certificate", value: "Premium" },
      { keyName: "Dedicated IP", value: "Included" },
      { keyName: "SLA Guarantee", value: "99.99% uptime" },
    ],
    limits: [
      { name: "Projects", value: "Unlimited" },
      { name: "API Calls", value: "1,000,000/month" },
      { name: "Team Members", value: "Unlimited" },
    ],
    discount: null,
  },
];

const PricingPlanComparison = () => {
  const { theme } = useTheme();
  const [pricingPlans, setPricingPlans] = useState<PricingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<SelectedPlan[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const { data, error } = await PricingService.fetchPricingDetailsData();
        if (error) {
          setError(error);
        } else if (data && data.length > 0) {
          setPricingPlans(data);
        } else {
          setPricingPlans(fallbackPlans);
        }
      } catch (err) {
        console.error("Error fetching pricing data:", err);
        setPricingPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  const getYearlyPrice = (plan: PricingDetails) => {
    let yearlyPrice = plan.price * 12;
    if (plan.discount?.type === "percentage") {
      yearlyPrice = yearlyPrice * (1 - plan.discount.value / 100);
    } else if (plan.discount?.type === "fixed") {
      yearlyPrice = yearlyPrice - plan.discount.value;
    }
    return yearlyPrice;
  };

  const formatPrice = (price: number) => price.toLocaleString();

  const getDisplayPrice = (plan: PricingDetails) =>
    billingCycle === "monthly" ? plan.price : Math.round(getYearlyPrice(plan));

  // Add plan to comparison
  const addPlanToComparison = (plan: PricingDetails) => {
    if (selectedPlans.length >= 3) {
      alert("You can compare a maximum of 3 plans at a time");
      return;
    }
    
    if (selectedPlans.some(p => p.id === plan.id)) {
      alert("This plan is already selected for comparison");
      return;
    }
    
    setSelectedPlans([...selectedPlans, { id: plan.id, name: plan.name, data: plan }]);
  };

  // Remove plan from comparison
  const removePlanFromComparison = (planId: number) => {
    setSelectedPlans(selectedPlans.filter(p => p.id !== planId));
  };

  // Clear all selected plans
  const clearAllPlans = () => {
    setSelectedPlans([]);
    setShowComparison(false);
  };

  // Start comparison
  const startComparison = () => {
    if (selectedPlans.length < 2) {
      alert("Please select at least 2 plans to compare");
      return;
    }
    setShowComparison(true);
  };

  // Reset comparison
  const resetComparison = () => {
    setShowComparison(false);
  };

  // Get all unique feature titles from selected plans
  const getAllFeatures = () => {
    const set = new Set<string>();
    selectedPlans.forEach((plan) => plan.data.features.forEach((f) => set.add(f.title)));
    return Array.from(set);
  };

  // Get all unique detail keys from selected plans
  const getAllDetails = () => {
    const set = new Set<string>();
    selectedPlans.forEach((plan) => plan.data.details?.forEach((d) => set.add(d.keyName)));
    return Array.from(set);
  };

  // Get all unique limits from selected plans
  const getAllLimits = () => {
    const set = new Set<string>();
    selectedPlans.forEach((plan) => plan.data.limits?.forEach((l) => set.add(l.name)));
    return Array.from(set);
  };

  if (loading) return <ComparisonSkeleton />;
  if (error) return <ComparisonError error={error} />;

  const allFeatures = getAllFeatures();
  const allDetails = getAllDetails();
  const allLimits = getAllLimits();

  const SectionDivider = ({ label }: { label: string }) => (
    <tr>
      <td
        colSpan={selectedPlans.length + 1}
        className="px-6 py-3"
        style={{
          backgroundColor: `${theme.primary}08`,
          borderTop: `1px solid ${theme.border}`,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: theme.primary }}
        >
          {label}
        </span>
      </td>
    </tr>
  );

  return (
    <section className="w-full py-20 px-4 relative overflow-hidden">
      {/* Background */}
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
        {/* Header */}
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
              Compare Plans
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-slide-in-up"
            style={{ color: theme.text }}
          >
            Find Your{" "}
            <span style={{ color: theme.primary }}>Perfect Match</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto animate-slide-in-up animation-delay-200"
            style={{ color: theme.textSecondary }}
          >
            Select up to 3 plans to compare features, pricing, and benefits side by side
          </p>
          <div
            className="w-20 h-1 rounded-full mx-auto mt-6 animate-scale-in animation-delay-400"
            style={{ backgroundColor: theme.primary }}
          />
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10 animate-fade-in-up animation-delay-600">
          <div
            className="flex p-1 rounded-full"
            style={{
              backgroundColor: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor:
                  billingCycle === "monthly" ? theme.primary : "transparent",
                color:
                  billingCycle === "monthly" ? "#ffffff" : theme.textSecondary,
                boxShadow:
                  billingCycle === "monthly"
                    ? `0 2px 8px ${theme.primary}40`
                    : "none",
              }}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor:
                  billingCycle === "yearly" ? theme.primary : "transparent",
                color:
                  billingCycle === "yearly" ? "#ffffff" : theme.textSecondary,
                boxShadow:
                  billingCycle === "yearly"
                    ? `0 2px 8px ${theme.primary}40`
                    : "none",
              }}
            >
              Yearly Billing
              <span
                className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    billingCycle === "yearly"
                      ? "rgba(255,255,255,0.2)"
                      : `${theme.primary}20`,
                  color:
                    billingCycle === "yearly" ? "#ffffff" : theme.primary,
                }}
              >
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Selection Section */}
        {!showComparison ? (
          <>
            {/* Selected Plans Display */}
            {selectedPlans.length > 0 && (
              <div className="mb-8 animate-fade-in-up animation-delay-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: theme.text }}>
                    Selected Plans ({selectedPlans.length}/3)
                  </h2>
                  <button
                    onClick={clearAllPlans}
                    className="text-sm px-3 py-1 rounded-lg transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: `${theme.error}10`,
                      color: theme.error,
                    }}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: `${theme.primary}10`,
                        border: `1px solid ${theme.primary}20`,
                      }}
                    >
                      <span className="font-medium text-sm" style={{ color: theme.text }}>
                        {plan.name}
                      </span>
                      <button
                        onClick={() => removePlanFromComparison(plan.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Plan Names Grid - Simple Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up animation-delay-1000">
              {pricingPlans.map((plan) => {
                const isSelected = selectedPlans.some(p => p.id === plan.id);
                const isMaxSelected = selectedPlans.length >= 3 && !isSelected;
                
                return (
                  <button
                    key={plan.id}
                    onClick={() => !isSelected && !isMaxSelected && addPlanToComparison(plan)}
                    disabled={isSelected || isMaxSelected}
                    className={`group p-4 rounded-xl transition-all duration-300 text-left ${
                      isSelected 
                        ? "opacity-50 cursor-default" 
                        : isMaxSelected 
                        ? "opacity-40 cursor-not-allowed" 
                        : "hover:scale-105 cursor-pointer"
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${theme.primary}10` : theme.background,
                      border: `2px solid ${
                        isSelected 
                          ? theme.primary 
                          : plan.isPopular 
                          ? theme.primary 
                          : theme.border
                      }`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg" style={{ color: theme.text }}>
                            {plan.name}
                          </h3>
                          {plan.isPopular && !isSelected && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: theme.primary, color: "#ffffff" }}
                            >
                              Popular
                            </span>
                          )}
                          {isSelected && (
                            <svg className="w-5 h-5" fill="none" stroke={theme.primary} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: theme.textSecondary }}>
                          ${formatPrice(getDisplayPrice(plan))}/{billingCycle === "monthly" ? "mo" : "yr"}
                        </p>
                      </div>
                      {!isSelected && !isMaxSelected && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{ backgroundColor: `${theme.primary}10` }}
                        >
                          <svg className="w-4 h-4" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      )}
                      {isSelected && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${theme.primary}20` }}
                        >
                          <svg className="w-4 h-4" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Compare Button */}
            {selectedPlans.length >= 2 && (
              <div className="text-center animate-fade-in-up animation-delay-1200">
                <button
                  onClick={startComparison}
                  className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: theme.primary,
                    color: "#ffffff",
                    boxShadow: `0 4px 15px ${theme.primary}40`,
                  }}
                >
                  Compare Selected Plans ({selectedPlans.length})
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Comparison Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 animate-fade-in-up">
              <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
                Plan Comparison
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={resetComparison}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: `${theme.primary}10`,
                    color: theme.primary,
                  }}
                >
                  Add/Remove Plans
                </button>
                <button
                  onClick={clearAllPlans}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: `${theme.error}10`,
                    color: theme.error,
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Comparison Table with new styles */}
            <div
              className="rounded-2xl overflow-hidden animate-fade-in-up animation-delay-200"
              style={{
                border: `1px solid ${theme.border}`,
                boxShadow: `0 25px 60px -12px ${theme.primary}15`,
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  {/* Sticky Plan Headers */}
                  <thead>
                    <tr>
                      {/* Feature label column */}
                      <th
                        className="p-6 text-left w-48 min-w-[180px]"
                        style={{ backgroundColor: theme.surface }}
                      >
                        <span
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{ color: theme.textSecondary }}
                        >
                          Features
                        </span>
                      </th>

                      {/* Plan columns */}
                      {selectedPlans.map((plan) => (
                        <th
                          key={plan.id}
                          className="p-6 text-center relative min-w-[180px]"
                          style={{
                            backgroundColor: plan.data.isPopular
                              ? `${theme.primary}08`
                              : theme.surface,
                            borderLeft: `1px solid ${theme.border}`,
                            borderBottom: plan.data.isPopular
                              ? `2px solid ${theme.primary}`
                              : `1px solid ${theme.border}`,
                          }}
                        >
                          {plan.data.isPopular && (
                            <div
                              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                              style={{
                                backgroundColor: theme.primary,
                                color: "#ffffff",
                                boxShadow: `0 2px 8px ${theme.primary}50`,
                              }}
                            >
                              Most Popular
                            </div>
                          )}

                          <div
                            className="text-base font-bold mb-1"
                            style={{ color: theme.text }}
                          >
                            {plan.name}
                          </div>
                          <div
                            className="text-2xl font-extrabold mb-0.5"
                            style={{ color: theme.primary }}
                          >
                            ${formatPrice(getDisplayPrice(plan.data))}
                            <span
                              className="text-sm font-normal ml-1"
                              style={{ color: theme.textSecondary }}
                            >
                              /{billingCycle === "monthly" ? "mo" : "yr"}
                            </span>
                          </div>
                          {billingCycle === "yearly" && plan.data.discount && (
                            <div
                              className="text-xs font-medium mb-2"
                              style={{ color: "#10b981" }}
                            >
                              {plan.data.discount.type === "percentage"
                                ? `${plan.data.discount.value}% off`
                                : `$${plan.data.discount.value} off`}
                            </div>
                          )}
                          <p
                            className="text-xs mb-4 leading-relaxed"
                            style={{ color: theme.textSecondary }}
                          >
                            {plan.data.description}
                          </p>
                          <button
                            className="w-full py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                            style={{
                              backgroundColor: plan.data.isPopular
                                ? theme.primary
                                : `${theme.primary}12`,
                              color: plan.data.isPopular ? "#ffffff" : theme.primary,
                              border: plan.data.isPopular
                                ? "none"
                                : `1px solid ${theme.primary}30`,
                              boxShadow: plan.data.isPopular
                                ? `0 4px 12px ${theme.primary}40`
                                : "none",
                            }}
                          >
                            Choose {plan.name}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* ── FEATURES ── */}
                    <SectionDivider label="Features" />

                    {allFeatures.map((featureTitle, idx) => (
                      <tr
                        key={featureTitle}
                        style={{
                          backgroundColor:
                            idx % 2 === 0 ? theme.background : `${theme.surface}60`,
                          borderTop: `1px solid ${theme.border}`,
                        }}
                      >
                        <td
                          className="px-6 py-3.5 text-sm font-medium"
                          style={{ color: theme.textSecondary }}
                        >
                          {featureTitle}
                        </td>
                        {selectedPlans.map((plan) => {
                          const feature = plan.data.features.find(
                            (f) => f.title === featureTitle
                          );
                          return (
                            <td
                              key={plan.id}
                              className="px-6 py-3.5 text-center"
                              style={{
                                borderLeft: `1px solid ${theme.border}`,
                                backgroundColor: plan.data.isPopular
                                  ? `${theme.primary}04`
                                  : undefined,
                              }}
                            >
                              {feature ? (
                                feature.isAvailable ? (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <div
                                      className="w-5 h-5 rounded-full flex items-center justify-center mx-auto"
                                      style={{ backgroundColor: `${theme.primary}15` }}
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke={theme.primary}
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2.5}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                    <span
                                      className="text-xs"
                                      style={{ color: theme.textSecondary }}
                                    >
                                      {feature.value}
                                    </span>
                                  </div>
                                ) : (
                                  <div
                                    className="w-5 h-5 rounded-full flex items-center justify-center mx-auto"
                                    style={{ backgroundColor: `${theme.error}10` }}
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      fill="none"
                                      stroke={theme.error || "#ef4444"}
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </div>
                                )
                              ) : (
                                <span style={{ color: theme.textSecondary }}>—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* ── ADDITIONAL DETAILS ── */}
                    {allDetails.length > 0 && (
                      <>
                        <SectionDivider label="Additional Details" />
                        {allDetails.map((detailKey, idx) => (
                          <tr
                            key={detailKey}
                            style={{
                              backgroundColor:
                                idx % 2 === 0
                                  ? theme.background
                                  : `${theme.surface}60`,
                              borderTop: `1px solid ${theme.border}`,
                            }}
                          >
                            <td
                              className="px-6 py-3.5 text-sm font-medium"
                              style={{ color: theme.textSecondary }}
                            >
                              {detailKey}
                            </td>
                            {selectedPlans.map((plan) => {
                              const detail = plan.data.details?.find(
                                (d) => d.keyName === detailKey
                              );
                              return (
                                <td
                                  key={plan.id}
                                  className="px-6 py-3.5 text-center text-sm font-medium"
                                  style={{
                                    color: theme.text,
                                    borderLeft: `1px solid ${theme.border}`,
                                    backgroundColor: plan.data.isPopular
                                      ? `${theme.primary}04`
                                      : undefined,
                                  }}
                                >
                                  {detail?.value || (
                                    <span style={{ color: theme.textSecondary }}>
                                      —
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </>
                    )}

                    {/* ── PLAN LIMITS ── */}
                    {allLimits.length > 0 && (
                      <>
                        <SectionDivider label="Plan Limits" />
                        {allLimits.map((limitName, idx) => (
                          <tr
                            key={limitName}
                            style={{
                              backgroundColor:
                                idx % 2 === 0
                                  ? theme.background
                                  : `${theme.surface}60`,
                              borderTop: `1px solid ${theme.border}`,
                            }}
                          >
                            <td
                              className="px-6 py-3.5 text-sm font-medium"
                              style={{ color: theme.textSecondary }}
                            >
                              {limitName}
                            </td>
                            {selectedPlans.map((plan) => {
                              const limit = plan.data.limits?.find(
                                (l) => l.name === limitName
                              );
                              return (
                                <td
                                  key={plan.id}
                                  className="px-6 py-3.5 text-center text-sm font-medium"
                                  style={{
                                    color: theme.text,
                                    borderLeft: `1px solid ${theme.border}`,
                                    backgroundColor: plan.data.isPopular
                                      ? `${theme.primary}04`
                                      : undefined,
                                  }}
                                >
                                  {limit?.value || (
                                    <span style={{ color: theme.textSecondary }}>
                                      —
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </>
                    )}

                    {/* ── BOTTOM CTA ROW ── */}
                    <tr style={{ borderTop: `2px solid ${theme.border}` }}>
                      <td
                        className="px-6 py-5"
                        style={{ backgroundColor: theme.surface }}
                      />
                      {selectedPlans.map((plan) => (
                        <td
                          key={plan.id}
                          className="px-6 py-5 text-center"
                          style={{
                            backgroundColor: plan.data.isPopular
                              ? `${theme.primary}08`
                              : theme.surface,
                            borderLeft: `1px solid ${theme.border}`,
                          }}
                        >
                          <button
                            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                            style={{
                              backgroundColor: plan.data.isPopular
                                ? theme.primary
                                : `${theme.primary}12`,
                              color: plan.data.isPopular ? "#ffffff" : theme.primary,
                              border: plan.data.isPopular
                                ? "none"
                                : `1px solid ${theme.primary}30`,
                              boxShadow: plan.data.isPopular
                                ? `0 4px 15px ${theme.primary}40`
                                : "none",
                            }}
                          >
                            Get Started
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
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
const ComparisonSkeleton = () => {
  const { theme } = useTheme();
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-6 w-32 mx-auto rounded-full mb-4 animate-pulse" style={{ backgroundColor: `${theme.primary}20` }} />
          <div className="h-12 w-64 mx-auto rounded-lg mb-4 animate-pulse" style={{ backgroundColor: `${theme.text}20` }} />
          <div className="h-5 w-96 mx-auto rounded-lg animate-pulse" style={{ backgroundColor: `${theme.textSecondary}20` }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl animate-pulse" style={{ backgroundColor: theme.surface }}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-6 w-24 rounded mb-1" style={{ backgroundColor: `${theme.text}20` }} />
                  <div className="h-4 w-20 rounded" style={{ backgroundColor: `${theme.textSecondary}20` }} />
                </div>
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: `${theme.primary}20` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Error Component
const ComparisonError = ({ error }: { error: string | null }) => {
  const { theme } = useTheme();
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 animate-bounce" style={{ backgroundColor: `${theme.error}10` }}>
          <svg className="w-10 h-10" fill="none" stroke={theme.error} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold mb-2" style={{ color: theme.text }}>{error || "Unable to Load Pricing Plans"}</h3>
        <p style={{ color: theme.textSecondary }}>Please check your connection and try again</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105" style={{ backgroundColor: theme.primary, color: "#ffffff" }}>
          Retry
        </button>
      </div>
    </section>
  );
};

export default PricingPlanComparison;