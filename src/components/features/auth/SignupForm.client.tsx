"use client";
import { motion } from "framer-motion";

interface SignupFormProps {
  email: string;
  error: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSocialLogin: (provider: "google" | "linkedin") => void;
  onSwitchToLogin: () => void;
  isloading: boolean;
  isDisabled: boolean;
}

const SignupForm = ({
  email,
  error,
  onEmailChange,
  onSubmit,
  onSocialLogin,
  onSwitchToLogin,
  isloading,
  isDisabled,
}: SignupFormProps) => {
  return (
    <>
      <motion.h2
        className="font-playfair"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Glad to have you!
      </motion.h2>
      <motion.p
        className="subtitle font-inter"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        To access your account, please enter your email and we will send you OTP
        for verification
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

        <motion.div
          className="inputGroup"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label htmlFor="email">Email</label>
          <motion.input
            type="text"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        <motion.button
          type="submit"
          className={isloading ? "loginButton disabled" : "loginButton"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          disabled={isloading || isDisabled}
        >
          Next
        </motion.button>
      </motion.form>

      <motion.div
        className="switchMode font-inter"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p>
          Already have an account?
          <motion.button
            type="button"
            className="switchModeButton"
            onClick={onSwitchToLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log in
          </motion.button>
        </p>
      </motion.div>
    </>
  );
};

export default SignupForm;
