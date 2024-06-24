import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiUrl = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const res = await axios.post(`${apiUrl}refresh`, {
      refreshToken,
    });
    localStorage.setItem("token", res.data.accessToken);
    return res.data.accessToken;
  } catch (err) {
    throw err;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      const expiryTime = decoded.exp * 1000; // JWT exp is in seconds, convert to milliseconds
      const currentTime = Date.now();

      if (expiryTime - currentTime < 5 * 60 * 1000) {
        // Refresh the token if it will expire in less than 5 minutes
        token = await refreshAccessToken();
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.log("Unable to refresh access token on client side:", err);

        // Redirect to login page on token refresh failure
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

const redirectToLogin = () => {
  // Redirect to the login page
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export default axiosInstance;
