import axios from "axios";
import type {
  authDataType,
  authUserDataType,
  getProfileDataType,
  getUsersDataType,
  logoutDataType,
  updateProfileDataType,
  userDataType,
} from "../types.js";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "",
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getProfile = async (): Promise<{ user: userDataType }> => {
  try {
    const response: getProfileDataType = await instance.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error checking authentication:", error);
    throw error;
  }
};

export const login = async (
  data: any
): Promise<{
  message: string;
  token: string;
  user: authUserDataType;
}> => {
  try {
    const response: authDataType = await instance.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const signUp = async (
  data: any
): Promise<{
  message: string;
  token: string;
  user: authUserDataType;
}> => {
  try {
    const response: authDataType = await instance.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const logout = async (): Promise<{ message: string }> => {
  try {
    const response: logoutDataType = await instance.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const updateProfile = async (
  data: any
): Promise<{
  message: string;
  user: userDataType;
}> => {
  try {
    const response: updateProfileDataType = await instance.put(
      "/user/update",
      data
    );
    console.log("response----->88",  data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<{
  message: string;
  users: userDataType[];
}> => {
  try {
    const response: getUsersDataType = await instance.get("/chat/users");
    console.log("59---->response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getMessages = async (userId: string) => {
  try {
    const response = await instance.get(`/chat/messages/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const sendMessage = async (userId: string, message: any) => {
  try {
    const response = await instance.post(
      `/chat/sendMessage/${userId}`,
      message
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default instance;
