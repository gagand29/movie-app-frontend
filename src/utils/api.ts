const API_BASE_URL = "http://localhost:5001/api";

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const signup = async (name: String,email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return response.json();
};

export const fetchMovies = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    return response.json();
  };

export const logout =() =>{
    localStorage.removeItem("token");
}