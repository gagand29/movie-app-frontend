import { API_BASE_URL } from "./constants";
import { toast } from "react-toastify";

// Function to get the access token from sessionStorage
const getAccessToken = () => sessionStorage.getItem("accessToken");

// Function to refresh the access token
export const refreshAccessToken = async () => {
  try {
    // Check if user already has an access token in sessionStorage
    if (!sessionStorage.getItem("accessToken")) {
      console.log("No access token found. User may need to log in.");
      return null; // Prevent unnecessary refresh attempts
    }

    const response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: "POST",
      credentials: "include", // Send cookies with request
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    const data = await response.json();
    sessionStorage.setItem("accessToken", data.accessToken); // Store new access token
    return data.accessToken;
  } catch (error) {
    console.error("Refresh Token Error:", error);
    logout(); // If refresh fails, force logout
    throw error;
  }
};



// Standardized API call helper
const fetchApi = async (url: string, options: RequestInit = {}) => {
  try {
    let token = sessionStorage.getItem("accessToken"); // Use sessionStorage for security
    
    // Detect if the request body is FormData (for multipart uploads)
    const isMultipart = options.body instanceof FormData;

    // Set headers dynamically
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization if token exists
      ...(!isMultipart && { "Content-Type": "application/json" }) // Only set JSON Content-Type if not multipart
    };

    // Merge headers and set credentials for cookies
    options.headers = { ...headers, ...(options.headers || {}) };
    options.credentials = "include"; //Ensures refreshToken cookie is sent

    let response = await fetch(url, options);

    // Handle Expired Token - Refresh Once
    if (response.status === 401) {
      console.log("Access token expired, trying refresh...");
      token = await refreshAccessToken();

      if (!token) throw new Error("Failed to refresh token, please log in again.");

      //Retry the request with new token
      options.headers = { ...headers, Authorization: `Bearer ${token}` };
      response = await fetch(url, options);
    }

    // Handle Non-Successful Responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    return await response.json();
  } catch (error: any) {
    console.error("API Error:", error.message);
    throw error;
  }
};

// Login API
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", //Ensures refresh token is stored as HTTP-only cookie
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    const data = await response.json();
    sessionStorage.setItem("accessToken", data.accessToken); //Store access token

    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};


// Signup API
export const signup = async (name: string, email: string, password: string) => {
  return fetchApi(`${API_BASE_URL}/signup`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

// Fetch Movies API
export const fetchMovies = async () => {
  return fetchApi(`${API_BASE_URL}/movies`, {
    method: "GET",
  });
};

// Logout API
export const logout = async () => {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include", // Clear refresh token cookie
    });
  } catch (error) {
    console.error("Logout Error:", error);
  }

  sessionStorage.removeItem("accessToken"); //Clear access token
  toast.success("Logged out successfully");
};



const api = { fetchApi, login, signup, fetchMovies, logout, refreshAccessToken };
export default api;