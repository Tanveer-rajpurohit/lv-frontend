"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./LoginForm.client";
import "../../../styles/auth-styles/base.auth.css";
import "../../../styles/auth-styles/mobile.auth.css";
import "../../../styles/auth-styles/layout.auth.css";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";
import OTPForm from "./OTPForm.client";
import { useAuth } from "../../../hooks/useAuth";
import PasswordSetupForm from "./PasswordSetupForm.client";
import { MotionImage } from "../../ui/Image";
import {
  containerVariants,
  formVariants,
  itemVariants,
} from "../../../constants/animation-variants";

type PageMode =
  | "login"
  | "otp-verify"
  | "social-confirm"
  | "reset-password"
  | "2fa";

const LoginClientPage = () => {
  const { login, forgotPassword, isLoading, resetPassword, verify2FA } =
    useAuth();
  const [mode, setMode] = useState<PageMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  const [socialProvider, setSocialProvider] = useState<
    "google" | "linkedin" | null
  >(null);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleForgotPassword = async () => {
    setError("");
    setDisplayMessage("");
    try {
      if (!email) {
        setError("Please enter your email address");
        return;
      }
      const response = await forgotPassword({ email });
      if (response.success) {
        setDisplayMessage("OTP sent successfully");
        setMode("otp-verify");
      } else if (!response.success) {
        setError(
          response.message ||
          "An error occurred while sending reset password email"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(
          error.message ||
          "An error occurred while sending reset password email"
        );
      } else {
        setError("An error occurred while sending reset password email");
      }
    }
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,12}$/;

    if (passwordRegex.test(password)) {
      setError("");
      return true;
    } else {
      setError(
        "Password must be 8-12 characters and include an uppercase, lowercase, number, and symbol."
      );
      return false;
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await login({
        request: {
          email,
          password,
          remember_me: rememberMe,
        },
      });
      if (response.success && response.data?.requires_2fa) {
        setDisplayMessage("Please enter the OTP sent to your email");
        setMode("2fa");
      } else if (response.success && response.data?.user.role === "user") {
        router.push("/profile-completion");
      } else if (response.success && !response.data?.requires_2fa) {
        router.push("/dashboard/home");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      setIsDialogOpen(true);
      if (error instanceof Error) {
        setError(error.message || "Login failed. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleSocialLogin = async (provider: "google" | "linkedin") => {
    setSocialProvider(provider);

    if (provider === "google") {
      try {
        const { data } = await authService.getGoogleAuthUrl();
        if (!data?.auth_url) {
          setError("Failed to get Google auth URL");
          return;
        }
        window.location.href = data.auth_url;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "Failed to initiate Google login");
        } else {
          setError("Failed to initiate Google login");
        }
      }
    } else {
      // LinkedIn implementation would go here
      setError("LinkedIn login not implemented yet");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleResendOTP = async () => {
    try {
      setError("");
      setOtp(["", "", "", "", "", ""]);
      setDisplayMessage("");

      if (mode === "2fa") {
        const response = await login({
          request: {
            email,
            password,
            remember_me: rememberMe,
          },
        });
        if (response.success && response.data?.requires_2fa) {
          setDisplayMessage("OTP has been sent");
          setMode("2fa");
          return;
        }
      }

      const response = await forgotPassword({ email });
      if (response.success) {
        setDisplayMessage("OTP sent successfully");
        setMode("otp-verify");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred while sending OTP");
      } else {
        setError("An error occurred while sending OTP");
      }
    }
  };

  const handleTakeOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setDisplayMessage("");
      const fullOtp = otp.join("");
      if (fullOtp.length !== 6) {
        setError("Please enter the complete 6-digit OTP.");
        return;
      }

      if (!fullOtp) {
        setError("Please enter the complete 6-digit OTP.");
        return;
      }

      if (mode === "2fa") {
        const response = await verify2FA({ email, otp: fullOtp });
        if (response.success) {
          router.push("/dashboard/home");
          return;
        }
      }
      setMode("reset-password");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred while verifying OTP");
      } else {
        setError("An error occurred while verifying OTP");
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setDisplayMessage("");
      const fullOtp = otp.join("");
      if (fullOtp.length !== 6) {
        setError("Please enter the complete 6-digit OTP.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!validatePassword(password)) {
        return;
      }
      const response = await resetPassword({
        email,
        otp: fullOtp,
        new_password: password,
      });
      if (response.success) {
        setDisplayMessage("Password reset successfully");
        setMode("login");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred while resetting password");
      } else {
        setError("An error occurred while resetting password");
      }
    }
  };

  const renderCurrentForm = () => {
    switch (mode) {
      case "login":
        return (
          <LoginForm
            email={email}
            password={password}
            rememberMe={rememberMe}
            error={error}
            displayMessage={displayMessage}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onRememberMeChange={setRememberMe}
            onSubmit={handleLogin}
            onSocialLogin={handleSocialLogin}
            onSwitchToSignup={() => router.push("/register")}
            onForgotPassword={handleForgotPassword}
            isLoading={isLoading}
          />
        );
      case "otp-verify":
        return (
          <OTPForm
            title="Reset Password"
            subtitle="Please Enter the OTP sent to your email"
            email={email}
            otp={otp}
            error={error}
            showEmail={true}
            buttonText="Reset Password"
            onOtpChange={handleOtpChange}
            onSubmit={handleTakeOTP}
            onResendOTP={handleResendOTP}
            isloading={isLoading}
            displayMessage={displayMessage}
          />
        );
      case "reset-password":
        return (
          <PasswordSetupForm
            password={password}
            error={error}
            onPasswordChange={handlePasswordChange}
            onSubmit={handleResetPassword}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={setConfirmPassword}
            isloading={isLoading}
            displayMessage={displayMessage}
            buttonText="Reset Password"
          />
        );
      case "2fa":
        return (
          <OTPForm
            title="2FA Verification"
            subtitle="Please enter the OTP sent to your email"
            otp={otp}
            error={error}
            showEmail={true}
            buttonText="Verify OTP"
            onOtpChange={handleOtpChange}
            onSubmit={handleTakeOTP}
            onResendOTP={handleResendOTP}
            isloading={isLoading}
            displayMessage={displayMessage}
          />
        );
      default:
        return null;
    }
  };

  // Determine which group the current mode belongs to
  const isAuthGroup = [
    "login",
    "signup",
    "otp-verify",
    "social-confirm",
    "set-password",
  ].includes(mode);
  const isSetupGroup = ["user-setup", "interests", "profession"].includes(mode);

  return (
    <motion.div
      className={`loginPage ${isAuthGroup ? "authGroup" : ""} ${isSetupGroup ? "setupGroup" : ""
        }`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left Image Section */}
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
          <motion.div
            className="imageText"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              For your rightful place in the creator economy.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="imageTextBottom"
            >
              Your peers are about to start producing high-value content in
              minutes, not days. Don't get left behind.
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Right Form Section */}
      <motion.div
        className={`formSection ${isAuthGroup ? "authFormSection" : ""} ${isSetupGroup ? "setupFormSection" : ""
          }`}
        variants={itemVariants}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className={`formContainer ${isAuthGroup ? "authFormContainer" : ""} ${isSetupGroup ? "setupFormContainer" : ""
            }`}
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

export default LoginClientPage;
