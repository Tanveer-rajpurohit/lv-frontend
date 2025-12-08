"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface OTPFormProps {
  title: string;
  subtitle: string;
  email?: string;
  otp: string[];
  error: string;
  showEmail?: boolean;
  buttonText: string;
  onOtpChange: (index: number, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResendOTP: (e: React.FormEvent) => void;
  isloading: boolean;
  displayMessage?: string;
}

const OTPForm = ({
  title,
  subtitle,
  email,
  otp,
  error,
  showEmail = false,
  buttonText,
  onOtpChange,
  onSubmit,
  onResendOTP,
  isloading,
  displayMessage,
}: OTPFormProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6);
      if (digits.length > 0) {
        for (let i = 0; i < 6; i++) {
          onOtpChange(i, digits[i] || "");
        }
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    if (!/^[0-9]?$/.test(value)) return;

    onOtpChange(index, value);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    if (digits.length > 0) {
      // Clear existing values first
      for (let i = 0; i < 6; i++) {
        onOtpChange(i, "");
      }

      // Distribute pasted digits across inputs
      for (let i = 0; i < 6; i++) {
        if (digits[i]) {
          onOtpChange(i, digits[i]);
        }
      }

      const nextIndex = Math.min(digits.length - 1, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <>
      <motion.h2
        className="font-playfair"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="subtitle font-inter"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {subtitle}
      </motion.p>

      <motion.form
        onSubmit={onSubmit}
        className="font-inter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {error && (
          <div className="errorMessageContainer">
            <motion.p
              className="errorMessage font-inter"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          </div>
        )}
        {displayMessage && (
          <div className="displayMessageContainer">
            <motion.p
              className="displayMessage font-inter"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {displayMessage}
            </motion.p>
          </div>
        )}

        {showEmail && email && (
          <motion.div
            className="inputGroup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label htmlFor="email">Email</label>
            <motion.input
              type="email"
              id="email"
              value={email}
              disabled
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        )}

        <motion.div
          className="inputGroup"
          initial={{ opacity: 0, x: -20, height: 0 }}
          animate={{ opacity: 1, x: 0, height: "auto" }}
          exit={{ opacity: 0, x: -20, height: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <label>OTP</label>
          <div className="passcodeInputs">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el: HTMLInputElement | null) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                // Only the first box handles paste of full OTP
                onPaste={index === 0 ? handlePaste : undefined}
                required
                whileFocus={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="resendSection"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.button
            type="button"
            onClick={onResendOTP}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="resendLink"
          >
            Resend PassCode
          </motion.button>
        </motion.div>

        <motion.button
          type="submit"
          className={isloading ? "loginButton disabled" : "loginButton"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          disabled={isloading}
        >
          {buttonText}
        </motion.button>
      </motion.form>
    </>
  );
};

export default OTPForm;
