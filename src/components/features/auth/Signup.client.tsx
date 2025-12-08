"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignupForm from "./SignupForm.client";
import OTPForm from "./OTPForm.client";
import PasswordSetupForm from "./PasswordSetupForm.client";
import "../../../styles/auth-styles/base.auth.css";
import "../../../styles/auth-styles/mobile.auth.css";
import "../../../styles/auth-styles/layout.auth.css";
import "../../../styles/auth-styles/setup-group.auth.css";
import "../../../styles/auth-styles/auth-group.auth.css";
import "../../../styles/auth-styles/group-specific.auth.css";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/auth.service";
import { useAuth } from "../../../hooks/useAuth";
import { genAIService } from "../../../lib/api/genAiService";
import { MotionImage } from "../../ui/Image";
import { validators } from "../../../utils/validators";
import {
  containerVariants,
  formVariants,
  itemVariants,
} from "../../../constants/animation-variants";
import Dialog from "../../ui/Dialog";
import WaitlistDialog from "../../ui/waitlist-dialog";

type PageMode = "signup" | "otp-verify" | "social-confirm" | "set-password";

const RegistrationPage = () => {
  const { signup, verifyOTP, isLoading, preRegister } = useAuth();
  const [mode, setMode] = useState<PageMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [socialProvider, setSocialProvider] = useState<
    "google" | "linkedin" | null
  >(null);
  const [displayMessage, setDisplayMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    genAIService.startTrackingMouse();
    genAIService.startRegistrationTimer();

    return () => {
      genAIService.stopTrackingMouse();
      genAIService.stopRegistrationTimer();
    };
  }, []);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (validators.validatePassword(value)) {
      setError("");
      setIsDisabled(false);
    } else {
      setError(
        "Password must be 8-12 characters and include an uppercase, lowercase, number, and symbol."
      );
      setIsDisabled(true);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (validators.validateInput(value)) {
      setError("");
      setIsDisabled(false);
    } else {
      setError("Please enter a valid email or phone number");
      setIsDisabled(true);
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    try {
      setError("");
      const response = await preRegister({
        email,
      });
      if (response.success && response.data && response.data.exists) {
        setMode("set-password")

      } else {
        setIsDialogOpen(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred while sending OTP");
      } else {
        setError("An error occurred while sending OTP");
      }
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setDisplayMessage("");
      if (!email) {
        setError("Please enter your email address");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!validators.validatePassword(password)) {
        return;
      }

      const response = await signup({
        request: {
          email: email,
        },
        device_data: genAIService.getDeviceInfo(),
      });
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
          setError(error.message || "Failed to initiate Google signup");
        } else {
          setError("Failed to initiate Google signup");
        }
      }
    } else {
      // LinkedIn implementation would go here
      setError("LinkedIn signup not implemented yet");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setDisplayMessage("");
      const fullOtp = otp.join("");
      if (fullOtp.length !== 6) {
        setError("Please enter the complete 6-digit OTP.");
        return;
      }

      const reponse = await verifyOTP({ otp: fullOtp, email, password });
      if (reponse.success) {
        router.push("/profile-completion");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred while verifying OTP");
      } else {
        setError("An error occurred while verifying OTP");
      }
    }
  };

  const handleSocialConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setMode("set-password");
  };

  const handleResendOTP = async () => {
    try {
      setError("");
      setOtp(["", "", "", "", "", ""]);
      setDisplayMessage("");
      const response = await signup({
        request: {
          email: email,
        },
      });
      if (response.success) {
        setDisplayMessage("OTP sent successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred while sending OTP");
      } else {
        setError("An error occurred while sending OTP");
      }
    }
  };

  // Render current form
  const renderCurrentForm = () => {
    switch (mode) {
      case "signup":
        return (
          <SignupForm
            email={email}
            error={error}
            onEmailChange={handleEmailChange}
            onSubmit={handleNext}
            onSocialLogin={handleSocialLogin}
            onSwitchToLogin={() => router.push("/login")}
            isloading={isLoading}
            isDisabled={isDisabled}
          />
        );
      case "otp-verify":
        return (
          <OTPForm
            title="Glad to have you!"
            subtitle="To access your account, please enter your email and we will send you OTP for verification"
            email={email}
            otp={otp}
            error={error}
            showEmail={true}
            buttonText="Signup"
            onOtpChange={handleOtpChange}
            onSubmit={handleVerifyOTP}
            onResendOTP={handleSendOTP}
            isloading={isLoading}
            displayMessage={displayMessage}
          />
        );
      case "social-confirm":
        return (
          <OTPForm
            title="Check Your Inbox!"
            subtitle="We've sent a 6-digit magic code to your email. Go find it and type it in below to continue."
            otp={otp}
            error={error}
            showEmail={false}
            buttonText="Continue"
            onOtpChange={handleOtpChange}
            onSubmit={handleSocialConfirm}
            onResendOTP={handleResendOTP}
            isloading={isLoading}
            displayMessage={displayMessage}
          />
        );
      case "set-password":
        return (
          <PasswordSetupForm
            password={password}
            confirmPassword={confirmPassword}
            error={error}
            onPasswordChange={handlePasswordChange}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleSendOTP}
            isloading={isLoading}
            displayMessage={displayMessage}
            buttonText="Send OTP"
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

  return (
    <motion.div
      className={`loginPage ${isAuthGroup ? "authGroup" : ""}`}
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

      <motion.div
        className={`formSection ${isAuthGroup ? "authFormSection" : ""}`}
        variants={itemVariants}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Mobile Logo */}

        <motion.div
          className={`formContainer ${isAuthGroup ? "authFormContainer" : ""}`}
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
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen((prev) => !prev)}
        size="lg"
        className="waitlist-dialog-container"
      >
        <WaitlistDialog />
      </Dialog>
    </motion.div>
  );
};

export default RegistrationPage;
