import { motion } from "framer-motion";
import "../../../styles/auth-styles/profession-form.auth.css";
import { professions } from "../../../constants/user-setup";

interface ProfessionFormProps {
  selectedProfession: string;
  error: string;
  onProfessionChange: (profession: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
}

const ProfessionForm = ({
  selectedProfession,
  error,
  onProfessionChange,
  onSubmit,
  onBack,
  isLoading,
}: ProfessionFormProps) => {
  return (
    <>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        And, What Do You Do?
      </motion.h2>
      <motion.p
        className="subtitle"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Are you a practicing lawyer, a law student, or a paralegal? Selecting
        your profession helps us build a better community for everyone.
      </motion.p>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {error && (
          <div className="errorMessageContainer">
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
          className="professionCards"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {professions.map((profession, index) => (
            <motion.div
              key={profession.id}
              className={`professionCard ${
                selectedProfession === profession.id ? "selected" : ""
              }`}
              onClick={() =>
                onProfessionChange(
                  selectedProfession === profession.id ? "" : profession.id
                )
              }
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundImage: `url(${profession.image})`,
              }}
            >
              <div className="cardContent">
                <div className="cardTitle">{profession.title}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="formActionsProfession"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.button
            type="submit"
            className={`loginButton ${isLoading ? "disabled" : ""} ${
              !selectedProfession ? "notLawPerson" : ""
            }`}
            disabled={!selectedProfession || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Finish
          </motion.button>
        </motion.div>
      </motion.form>
    </>
  );
};

export default ProfessionForm;
