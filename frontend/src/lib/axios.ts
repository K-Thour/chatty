import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Adjust the base URL as needed
  withCredentials: true, // Include credentials for cross-origin requests
  timeout: 10000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProfile = async () => {
  try {
    const response = await instance.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error checking authentication:", error);
    throw error;
  }
};

export const login = async (data: any) => {
  try {
    const response = await instance.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const signUp = async (data: any) => {
  try {
    console.log(data);
    const response = await instance.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await instance.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};


export default instance;
