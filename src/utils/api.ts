import { API_BASE_URL } from "./constants";
import { toast } from "react-toastify";

// Standardized API call helper
const fetchApi = async (url: string, options: RequestInit = {}) => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage

    // Authorization header if token exists
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Add only if token exists
    };

    //Merge existing headers with Authorization
    options.headers = { ...headers, ...(options.headers || {}) };

    const response = await fetch(url, options);
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


//Login API
export const login = async (email: string, password: string) => {
  const response = await fetchApi(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.token) {
    localStorage.setItem("token", response.token); //Save token
  }

  return response;
};


// Signup API
export const signup = async (name: string, email: string, password: string) => {
  return fetchApi(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
};

//Fetch Movies API
export const fetchMovies = async () => {
  const token = localStorage.getItem("token");
  console.log("Token in fetchMovies:", token ? "Token exists" : "No token found");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return fetchApi(`${API_BASE_URL}/movies`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Ensure token is included
    },
  });
};



// Logout
export const logout = () => {
  localStorage.removeItem("token");
  toast.success("Logged out successfully");
};
