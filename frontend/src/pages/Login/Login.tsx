import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
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
      setError("Invalid credentials.");
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

          {error && <p className="login-message">{error}</p>}
        </form>
      </div>
      <div className="register-container">
        <h1 className="switzer-bold">No account?</h1>
        <p className="register-message switzer-regular">
          No account? Unlucky, continue as guest for now.
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
