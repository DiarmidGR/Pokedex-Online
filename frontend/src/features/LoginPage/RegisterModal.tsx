import "./RegisterModal.css";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, isDark }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/register`, {
        username,
        password,
      }, { withCredentials: true });
      toast.success("Account created! You can now log in.");
      handleClose();
    } catch (err) {
      toast.error("Registration failed. Try a different username.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className={`modal-content ${isDark ? "dark" : "light"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-button" onClick={handleClose} aria-label="Close">
          ×
        </button>

        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="login-header switzer-bold">Create an Account</h1>
          <h3 className="login-subheader switzer-regular">
            Register to get started
          </h3>

          <label htmlFor="" className="login-child">
            <input
              type="text"
              className="login-input switzer-regular"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </label>

          <label htmlFor="" className="login-child">
            <input
              type="password"
              className="login-input switzer-regular"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </label>

          <label htmlFor="" className="login-child">
            <input
              type="password"
              className="login-input switzer-regular"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
            />
          </label>

          <button type="submit" className="login-button switzer-bold" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;