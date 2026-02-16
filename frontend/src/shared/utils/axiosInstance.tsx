import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AxiosRequestConfig } from "axios";

const apiUrl = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Structure definition for a retry queue item
interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

// List to gold RequestQueue
const refreshAndRetryQueue: RetryQueueItem[] = [];

// Prevents multiple token refresh requests
let isRefreshing = false;

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const res = await axios.post(`${apiUrl}/refresh`, {
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

// references:
// https://medium.com/@sina.alizadeh120/repeating-failed-requests-after-token-refresh-in-axios-interceptors-for-react-js-apps-50feb54ddcbc
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig = error.config;

    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
      }
      try {
        // Refresh access token
        const newAccessToken = await refreshAccessToken();

        // Update the request headers with the new access token
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry all requests in queue with new token
        refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
          axiosInstance
            .request(config)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
        });

        // Clear queue
        refreshAndRetryQueue.length = 0;

        // Retry original request
        return axiosInstance(error.config);
      } catch (refreshError) {
        // Handle token refresh error
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        redirectToLogin();
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    // Add original request to queue
    return new Promise<void>((resolve, reject) => {
      refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
    });
    // Return Promis rejection if status code is not 401
    return Promise.reject(error);
  }
);

const redirectToLogin = () => {
  window.location.href = "/login?message=refresh-error";
};

export default axiosInstance;
