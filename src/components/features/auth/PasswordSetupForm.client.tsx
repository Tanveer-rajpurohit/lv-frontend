
"use client"
import { motion } from 'framer-motion';
import { useState } from 'react';


interface PasswordSetupFormProps {
    password: string;
    confirmPassword: string;
    error: string;
    onPasswordChange: (password: string) => void;
    onConfirmPasswordChange: (confirmPassword: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isloading: boolean;
    displayMessage?: string;
    buttonText?: string;
}

const PasswordSetupForm = ({
    password,
    confirmPassword,
    error,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
    isloading,
    buttonText = "Submit",
    displayMessage
}: PasswordSetupFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <>
            <motion.h2
                className="font-playfair"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Set your Password
            </motion.h2>
            <motion.p
                className="subtitle font-inter"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                We've sent a 6-digit magic code to your email. Go find it and type it in below to continue.
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
                    <motion.p
                        className="displayMessage font-inter"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        {displayMessage}
                    </motion.p>
                )}

                <motion.div
                    className="inputGroup"
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <label htmlFor="newPassword">Enter Password</label>
                    <div className="passwordInputContainer">
                        <motion.input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            required
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.button
                            type="button"
                            className="passwordToggle"
                            onClick={() => setShowPassword(!showPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                <motion.div
                    className="inputGroup"
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="passwordInputContainer">
                        <motion.input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => onConfirmPasswordChange(e.target.value)}
                            required
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.button
                            type="button"
                            className="passwordToggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {showConfirmPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </motion.button>
                    </div>
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
                    {isloading ? "Please wait..." : buttonText}
                </motion.button>
            </motion.form>
        </>
    );
};

export default PasswordSetupForm;