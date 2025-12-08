"use client";

import { useState, useCallback } from "react";
import { useSubscription } from "@/src/hooks/useSubscription";
import { useAuthStore } from "@/src/store/slices/auth.slice";
import SubscriptionCard from "@/src/components/subscription/SubscriptionCard";
import FeedbackDialog from "@/src/components/subscription/FeedbackDialog";
import Sidebar from "@/src/components/dashboard/Sidebar";
import NewProjectModal from "@/src/components/dashboard/NewProjectModal";

const plans = [
  {
    name: "Basic",
    price: 299,
    description: "For a Individuals Students Starting Out their career",
    badge: null,
    features: ["upto 5 projects", "Basic AI features", "Access to Legal Databases"],
    previousFeatures: null,
    buttonText: "I'd Pay for this",
    buttonStyle: "secondary" as const,
    isHighlighted: false,
  },
  {
    name: "Pro",
    price: 499,
    description: "For Researchers looking to grow their career",
    badge: "243 People have share there Interest",
    features: ["upto 10 projects", "Uptime Monitoring", "Advanced 24 hours live support"],
    previousFeatures: "All Basic features +",
    buttonText: "I'd Pay for this",
    buttonStyle: "primary" as const,
    isHighlighted: true,
  },
  {
    name: "Ultimate",
    price: 799,
    originalPrice: 999,
    description: "For Serious Researcher Team who wants a platform for collaboration",
    badge: null,
    features: ["Unlimited", "Advanced AI insides", "Access to all databases"],
    previousFeatures: "All Pro features +",
    buttonText: "I'd Pay for this",
    buttonStyle: "secondary" as const,
    isHighlighted: false,
  },
];

export default function SubscriptionPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { sendFeedback, isLoading } = useSubscription();
  const { profile } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("subscription");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleNavClick = useCallback((id: string) => {
    setActiveNav(id);
  }, []);

  const handleNewProject = useCallback(() => {
    setIsNewProjectModalOpen(true);
  }, []);

  const handleSendFeedback = useCallback(
    async (plan: typeof plans[0]) => {
      try {
        if (!profile?.user_id) {
          return;
        }
        const response = await sendFeedback({
          user_id: profile.user_id,
          subscription_type: plan.name,
        });
        if (response.success) {
          setIsDialogOpen(true);
        }
      } catch (error) {
        console.error("Failed to send feedback:", error);
      }
    },
    [profile, sendFeedback]
  );

  return (
    <main className="flex-1 overflow-y-auto bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#393634]">Help Shape Our Pricing</h1>
          <p className="text-lg text-gray-600">
            We're validating our pricing model. Show us which plan works for you—no payment required.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <SubscriptionCard key={plan.name} {...plan} onClick={() => handleSendFeedback(plan)} />
          ))}
        </div>
      </div>
      <FeedbackDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        icon="✓"
        title="Thanks for your feedback!"
        subtitle="You've shown interest in Pro Plan"
        steps={[
          { text: "We'll email you when we launch (no spam, promise)" },
          { text: "Get [15% launch discount]" },
          { text: "Takes 30 seconds: Tell us more about your needs [Go to Survey]" },
        ]}
      />
    </main>
  );
}

