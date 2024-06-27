import { jwtDecode } from "jwt-decode";

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
