import { motion } from 'framer-motion';
import '../../../styles/auth-styles/interest-form.auth.css';
import { interests } from '../../../constants/user-setup';

interface InterestsFormProps {
    selectedInterests: string[];
    error: string;
    onToggleInterest: (interest: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

const InterestsForm = ({
    selectedInterests,
    error,
    onToggleInterest,
    onSubmit,
    onBack
}: InterestsFormProps) => {


    return (
        <>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                What Piques Your Interest?
            </motion.h2>
            <motion.p
                className="subtitle"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                Tap on up to three bubbles to tell us what you'd like to see. This will help us personalize your content from day one.
            </motion.p>

            <motion.div
                className="selectionCounter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {selectedInterests.length} of 3 selected
            </motion.div>

            <motion.form
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='interestForm'
            >
                {error && (
                    <div className='errorMessageContainer'>
                        <motion.p
                            className="errorMessage"
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
                    className="interestsGrid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {/* First row - 4 bubbles */}
                    <div className="row">
                        {interests.slice(0, 4).map((interest, index) => {
                            const isSelected = selectedInterests.includes(interest);
                            const isDisabled = !isSelected && selectedInterests.length >= 3;

                            return (
                                <motion.button
                                    key={interest}
                                    type="button"
                                    className={`interestBubble ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                    onClick={() => !isDisabled && onToggleInterest(interest)}
                                    disabled={isDisabled}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                >
                                    {interest}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Second row - 3 bubbles */}
                    <div className="row">
                        {interests.slice(4, 7).map((interest, index) => {
                            const isSelected = selectedInterests.includes(interest);
                            const isDisabled = !isSelected && selectedInterests.length >= 3;

                            return (
                                <motion.button
                                    key={interest}
                                    type="button"
                                    className={`interestBubble ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                    onClick={() => !isDisabled && onToggleInterest(interest)}
                                    disabled={isDisabled}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 + (index + 4) * 0.1 }}
                                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                >
                                    {interest}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Third row - 3 bubbles */}
                    <div className="row">
                        {interests.slice(7, 10).map((interest, index) => {
                            const isSelected = selectedInterests.includes(interest);
                            const isDisabled = !isSelected && selectedInterests.length >= 3;

                            return (
                                <motion.button
                                    key={interest}
                                    type="button"
                                    className={`interestBubble ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                    onClick={() => !isDisabled && onToggleInterest(interest)}
                                    disabled={isDisabled}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 + (index + 7) * 0.1 }}
                                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                >
                                    {interest}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Fourth row - 2 bubbles */}
                    <div className="row">
                        {interests.slice(10, 12).map((interest, index) => {
                            const isSelected = selectedInterests.includes(interest);
                            const isDisabled = !isSelected && selectedInterests.length >= 3;

                            return (
                                <motion.button
                                    key={interest}
                                    type="button"
                                    className={`interestBubble ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                    onClick={() => !isDisabled && onToggleInterest(interest)}
                                    disabled={isDisabled}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 + (index + 10) * 0.1 }}
                                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                >
                                    {interest}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div
                    className="formActionsInterest"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <motion.button
                        type="button"
                        className="OnBackButton"
                        onClick={onBack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Back
                    </motion.button>
                    <motion.button
                        type="submit"
                        className="loginButton"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Next
                    </motion.button>
                </motion.div>
            </motion.form>
        </>
    );
};

export default InterestsForm;