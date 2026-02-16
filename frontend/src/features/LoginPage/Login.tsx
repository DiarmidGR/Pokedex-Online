import "./Login.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, {useToasterStore} from "react-hot-toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Code to limit toasts on screen to 1, obtained from https://stackoverflow.com/a/72932186
  const {toasts} = useToasterStore();
  const TOAST_LIMIT = 1;
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only consider visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit
      .forEach((t) => toast.remove(t.id)); // Remove the toast
  }, [toasts]);

  let navigate = useNavigate();

  // Code to show error message toast if user was redirected from a token refresh error
  const searchParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    if (searchParams.get('message') === 'refresh-error') {
      toast.error('Session expired. Login to continue.');
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/login`,
        {
          username,
          password,
        }
      );
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      toast.error("Invalid credentials.");
    }
  };

  return (
    <div className="login-layout">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="login-header switzer-bold">Login to Your Account</h1>
          <h3 className="login-subheader switzer-regular">
            Login using admin provided info
          </h3>
          <label htmlFor="" className="login-child">
            <input
              type="username"
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
          <button type="submit" className="login-button switzer-bold">
            Sign In
          </button>

        </form>
      </div>
      <div className="register-container">
        <h1 className="switzer-bold">No account?</h1>
        <p className="register-message switzer-regular">
          No account? Continue as guest for now.
        </p>
        <button
          className="guest-button switzer-bold"
          onClick={() => navigate("/")}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

export default Login;
