import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
  exp: number;
}

// Utility for token handling
export const setToken = (token: any) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getUsername = () => {
  return localStorage.getItem("username");
};

// Return bool of jwt token status
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  // Decode token and check expiration
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    if (Date.now() >= exp * 1000) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

// Sign the user out and remove any important stored local variables
export const logoutUser = async () => {
  let navigate = useNavigate();
  removeToken();
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
  navigate("/login");
};
