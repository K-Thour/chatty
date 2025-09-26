import toast from "react-hot-toast";
import { create } from "zustand";
import {
  deleteSendRequest,
  getAllPending as fetchAllPending,
  getFriends as fetchFriends,
  getAllPendingReceivedRequests,
  handleRequest,
  sendRequest as sendFriendRequest,
} from "../lib/axios";
import type { SendRequestBody } from "../types.js";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface FriendRequest {
  _id: string;
  friendId: User;
  status: "pending" | "accepted" | "rejected";
}

export interface FriendStore {
  friends: User[];
  isFriendsLoading: boolean;
  isRequestsLoading: boolean;
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  sentPendingRequests: FriendRequest[];
  getFriends: () => Promise<void>;
  sendRequest: (friendId: string) => Promise<void>;
  getAllPending: () => Promise<void>;
  deleteSendRequest: (id: string) => Promise<void>;
  getAllPendingReceivedRequests: () => Promise<void>;
  handleRequest: (id: string, body: SendRequestBody) => Promise<void>;
}

export const useFriendStore = create<FriendStore>((set, get) => ({
  friends: [],
  isFriendsLoading: false,
  isRequestsLoading: false,
  sentRequests: [],
  sentPendingRequests: [],
  receivedRequests: [],
  getFriends: async () => {
    set({ isFriendsLoading: true });
    try {
      const users = await fetchFriends();
      set({ friends: users as any });
    } catch (error: any) {
      console.error("Error fetching friends:", error);
      toast.error(error?.response?.data?.message || "Unable to get friends");
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  sendRequest: async (friendId: string) => {
    set({ isRequestsLoading: true });
    try {
      const response = await sendFriendRequest(friendId);
      toast.success(response.message);
    } catch (error: any) {
      console.error("Error sending request:", error);
      toast.error(error?.response?.data?.message || "Unable to send request");
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  getAllPending: async () => {
    set({ isRequestsLoading: true });
    try {
      const response = await fetchAllPending();
      set({ sentPendingRequests: response as any });
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast.error(error?.response?.data?.message || "Unable to fetch requests");
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  deleteSendRequest: async (id: string) => {
    set({ isRequestsLoading: true });
    try {
      const response = await deleteSendRequest(id);
      toast.success(response.message);
    } catch (error: any) {
      console.error("Error cancel request:", error);
      toast.error(error?.response?.data?.message || "Unable to cancel request");
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  getAllPendingReceivedRequests: async () => {
    set({ isRequestsLoading: true });
    try {
      const requests: any = await getAllPendingReceivedRequests();
      set({ receivedRequests: requests });
    } catch (error: any) {
      console.error("Error fetch recieved requests:", error);
      toast.error(
        error?.response?.data?.message || "Unable to fetch recieved requests"
      );
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  handleRequest: async (id: string, body: SendRequestBody) => {
    set({ isRequestsLoading: true });
    try {
      const response = await handleRequest(id, body);
      toast.success(response.message);
    } catch (error: any) {
      console.error("Error handle request:", error);
      toast.error(error?.response?.data?.message || "Unable to handle request");
    } finally {
      set({ isRequestsLoading: false });
    }
  },
}));
