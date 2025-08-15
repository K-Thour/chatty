import {create} from 'zustand';
import { getProfile, login, logout, signUp } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false, 
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    signUp: async (data: any) => {
        set({ isSigningUp: true });
        try {
            const user = await signUp(data);
            set({ authUser: user, isSigningUp: false });
            toast.success("Sign Up successful! Redirecting to homepage...");
            toast.success(`Welcome, ${user?.user?.name || user?.user?.email}!`);
        } catch (error) {
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
        } catch (error) {
            console.error("Login failed:", error);
            set({ isLoggingIn: false });
            throw error;
        }
    },
    logout: async () => {
        try {
            await logout();
            set({ authUser: null });
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
        } catch (error) {
            console.error("Authentication check failed:", error);
            set({ authUser: null, isCheckingAuth: false });
        }
    }
}));

