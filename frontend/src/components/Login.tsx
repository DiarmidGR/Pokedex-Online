import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_LOGIN_ENDPOINT;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(apiUrl, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form lato-regular">
      <h2 className="text-center lato-bold">Sign In</h2>
      <label htmlFor="" className="login-child">
        Username
        <input
          type="username"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>

      <label htmlFor="" className="login-child">
        Password
        <input
          type="password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="login-child login-button lato-bold">
        LOGIN
      </button>
      <p className="login-guest">
        No account? Continue as <a href="/">Guest</a>
      </p>
      {error && <p className="login-message">{error}</p>}
    </form>
  );
}

export default Login;
