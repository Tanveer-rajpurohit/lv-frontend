"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../../styles/auth-styles/base.auth.css";
import "../../../styles/auth-styles/mobile.auth.css";
import "../../../styles/auth-styles/layout.auth.css";
import "../../../styles/auth-styles/setup-group.auth.css";
import "../../../styles/auth-styles/auth-group.auth.css";
import "../../../styles/auth-styles/group-specific.auth.css";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { MotionImage } from "../../ui/Image";
import {
  containerVariants,
  formVariants,
  itemVariants,
} from "../../../constants/animation-variants";
import InterestsForm from "./InterestForm";
import UserSetupForm from "./UserSetupForm.client";
import ProfessionForm from "./ProfessionForm.client";

// Matches old project flow: name -> interests -> profession

type PageMode = "user-setup" | "interests" | "profession";

const ProfileCompletionClient = () => {
  const { isLoading, UserSetup } = useAuth();
  const [mode, setMode] = useState<PageMode>("profession");
  const [name, setName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUserSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setMode("interests");
  };

  const handleInterests = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (selectedInterests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }
    if (selectedInterests.length > 3) {
      setError("Please select a maximum of 3 interests.");
      return;
    }
    setMode("profession");
  };

  const handleProfession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const response = await UserSetup({
        role: selectedProfession || "student",
      });
      if (response.success) {
        router.push("/dashboard/home");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to save the profile");
      } else {
        setError("Failed to save the profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      } else if (prev.length < 3) {
        return [...prev, interest];
      }
      return prev;
    });
  };

  const handleBack = () => {
    if (mode === "user-setup") {
      router.push("/dashboard/home");
    } else if (mode === "interests") {
      setMode("user-setup");
    } else if (mode === "profession") {
      setMode("interests");
    }
  };

  const isSetupGroup = ["user-setup", "interests", "profession"].includes(mode);

  const renderCurrentForm = () => {
    switch (mode) {
      case "user-setup":
        return (
          <UserSetupForm
            name={name}
            error={error}
            onNameChange={setName}
            onSubmit={handleUserSetup}
            onBack={handleBack}
          />
        );
      case "interests":
        return (
          <InterestsForm
            selectedInterests={selectedInterests}
            error={error}
            onToggleInterest={toggleInterest}
            onSubmit={handleInterests}
            onBack={handleBack}
          />
        );
      case "profession":
        return (
          <ProfessionForm
            selectedProfession={selectedProfession}
            error={error}
            onProfessionChange={setSelectedProfession}
            onSubmit={handleProfession}
            onBack={handleBack}
            isLoading={isLoading || loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`loginPage setupGroup`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence>
        <motion.div
          className="imageSection"
          variants={itemVariants}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <MotionImage
            className="img"
            src="/assets/images/background-image/backgroundImage.png"
            alt="Lawvriksh Tree"
            width={900}
            height={900}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="formSection setupFormSection"
        variants={itemVariants}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="formContainer setupFormContainer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="loginForm"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {renderCurrentForm()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileCompletionClient;
