import toast from "react-hot-toast";
import { create } from "zustand";
import {
  deleteSendRequest,
  getAllPending as fetchAllPending,
  getFriends as fetchFriends,
  getAllPendingReceivedRequests,
  getMessages,
  handleRequest,
  removeFriend,
  sendRequest as sendFriendRequest,
} from "../lib/axios";
import type {
  authUserDataType,
  messageDataType,
  NotificationDataType,
  SendRequestBody,
} from "../types.js";
import { useAuthStore } from "./useAuthStore.js";
import { useChatStore, type ChatStore } from "./useChatStore.js";
import { formatMessageTime } from "../lib/utils.js";

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface FriendRequest {
  id: string;
  friendId: User;
  status: "pending" | "accepted" | "rejected";
}

export interface FriendStore {
  friends: User[];
  isFriendsLoading: boolean;
  isRequestsLoading: boolean;
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
  notifications: NotificationDataType[];
  notificationsCount: number;
  sentPendingRequests: FriendRequest[];
  getFriends: () => Promise<void>;
  sendRequest: (friendId: string) => Promise<void>;
  getAllPending: () => Promise<void>;
  deleteSendRequest: (id: string) => Promise<void>;
  getAllPendingReceivedRequests: () => Promise<void>;
  handleRequest: (id: string, body: SendRequestBody) => Promise<void>;
  removeFriend: (id: string) => Promise<void>;
  subscribeToUnreadCount: () => void;
  unsubscribeFromUnreadCount: () => void;
  emptyNotifications: () => void;
  resetNotificationsCount: () => void;
  resetUnreadCount: (id: string) => void;
}

export const useFriendStore = create<FriendStore>((set, get) => ({
  friends: [],
  isFriendsLoading: false,
  isRequestsLoading: false,
  sentRequests: [],
  sentPendingRequests: [],
  receivedRequests: [],
  notifications: [],
  notificationsCount: 0,
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
  removeFriend: async (id: string) => {
    set({ isRequestsLoading: true });
    try {
      const response = await removeFriend(id);
      toast.success(response.message);
    } catch (error: any) {
      console.error("Error removing friend:", error);
      toast.error(error?.response?.data?.message || "Unable to remove friend");
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  resetUnreadCount: (id: string) => {
    set((state: any) => {
      const updatedFriends = state.friends.map((friend: any) => {
        if (friend.id === id) {
          return { ...friend, unreadCount: 0 };
        }
        return friend;
      });
      return { friends: updatedFriends };
    });
  },

  subscribeToUnreadCount: () => {
    const { authUser, socket } = useAuthStore.getState() as {
      authUser: authUserDataType;
      socket: any;
    };

    if (!authUser) return;
    socket.off("newMessage");
    socket.on("newMessage", async (message: messageDataType) => {
      const { selectedUser, messages } = useChatStore.getState() as ChatStore;
      if (selectedUser?.id) {
        await getMessages(selectedUser.id);
        useChatStore.setState({
          messages:
            selectedUser?.id === message.senderId
              ? [...messages, message]
              : messages,
        });
      };
      const { notifications, notificationsCount, emptyNotifications } = get() as FriendStore;
      if (notificationsCount > 9) {
        emptyNotifications();
      }
      set((state: any) => {
        const { friends } = state as { friends: User[] };
        let senderName;
        const updatedFriends = friends.map((friend: any) => {
          if (
            friend.id === message.senderId &&
            selectedUser?.id !== message.senderId // not the open chat
          ) {
            senderName = friend.name;
            return { ...friend, unreadCount: (friend.unreadCount ?? 0) + 1 };
          }
          return friend;
        });

        const newNotification: NotificationDataType = {
          userId: message.senderId,
          text: `New message recieved from ${senderName}`,
          time: formatMessageTime(message.createdAt),
        };
        return {
          friends: updatedFriends,
          notifications:
            selectedUser?.id === message.senderId
              ? notifications
              : [newNotification, ...notifications],
          notificationsCount: notificationsCount + 1,
        };
      });
    });
  },

  unsubscribeFromUnreadCount: () => {
    const { socket }: any = useAuthStore.getState();
    socket.off("newMessage");
  },
  emptyNotifications: () => set({ notifications: [] }),
  resetNotificationsCount: () => set({ notificationsCount: 0 }),
}));
