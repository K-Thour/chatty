import { create } from "zustand";
import { getProfile, login, logout, signUp, updateProfile } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const useAuthStore = create((set, get: any) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isSocketConnected: false,
  socket: null,
  onlineUsers: [],
  signUp: async (data: any) => {
    set({ isSigningUp: true });
    try {
      const user = await signUp(data);
      set({ authUser: user, isSigningUp: false });
      toast.success("Sign Up successful! Redirecting to homepage...");
      toast.success(`Welcome, ${user?.user?.name || user?.user?.email}!`);
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Sign up failed");
      console.error("Sign up failed:", error);
      set({ isSigningUp: false });
      throw error;
    }
  },
  login: async (data: any) => {
    set({ isLoggingIn: true });
    try {
      const user = await login(data);
      set({ authUser: user, isLoggingIn: false });
      toast.success("Log In successful! Redirecting to homepage...");
      toast.success(`Welcome back, ${user?.user?.name || user?.user?.email}!`);
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login failed:", error);
      set({ isLoggingIn: false });
      throw error;
    }
  },
  logout: async () => {
    try {
      await logout();
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const user = await getProfile();
      set({ authUser: user, isCheckingAuth: false });
      get().connectSocket();
    } catch (error) {
      console.error("Authentication check failed:", error);
      set({ authUser: null, isCheckingAuth: false });
    }
  },
  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });
    try {
      const user = await updateProfile(data);
      set({ authUser: user, isUpdatingProfile: false });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Profile update failed");
      console.error("Profile update failed:", error);
      set({ isUpdatingProfile: false });
      throw error;
    }
  },
  connectSocket: () => {
    const { authUser, isSocketConnected } = get();
    console.log(authUser, isSocketConnected);
    if (!authUser || isSocketConnected) return;
    const socket = io(BACKEND_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      query: { userId: authUser.user.id },
    });
    socket.connect();
    set({ socket, isSocketConnected: true });
    socket.on("getOnlineUsers", (userIds) => {
      console.log("Online users:", userIds);
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket, isSocketConnected } = get();
    if (!isSocketConnected) return;
    socket.disconnect();
    set({ socket: null, isSocketConnected: false });
  },
}));
