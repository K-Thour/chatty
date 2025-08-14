import {create} from 'zustand';
import { getProfile } from '../lib/axios';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false, 
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
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

