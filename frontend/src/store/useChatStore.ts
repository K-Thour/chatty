import { create } from "zustand";
import { getUsers as fetchUsers, getMessages, sendMessage } from "../lib/axios";
import toast from "react-hot-toast";
import type {
  messageDataType,
  userDataType,
} from "../types.js";

export interface ChatStore {
  // state
  messages: messageDataType[];
  users: userDataType[];
  selectedUser: userDataType | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  // actions
  getUsers: (query: string) => Promise<void>;
  resetUsers: () => void;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (message: any) => Promise<void>;
  setSelectedUser: (user: userDataType | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async (query: string) => {
    set({ isUsersLoading: true });
    try {
      const users = await fetchUsers(query);
      set({ users: users });
    } catch (error: any) {
      console.error("Error fetching friends:", error);
      toast.error(error?.response?.data?.message || "Unable to get users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  resetUsers: () => {
    set({ users: [] });
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const messages = await getMessages(userId);
      const { users } = get() as { users: userDataType[] };
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, unreadCount: 0 } : u
      );
      set({ messages: messages.messages, users: updatedUsers });
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast.error(error?.response?.data?.message || "Unable to get messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (message: any) => {
    try {
      const { selectedUser, messages }: any = get();
      const response = await sendMessage(selectedUser.id, message);
      set(() => ({
        messages: [...messages, response.messageData],
      }));
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error?.response?.data?.message || "Unable to send message");
    }
  },
  setSelectedUser: (user: any) => {
    if (!user) {
      set({ selectedUser: user });
      return;
    }
    set({
      selectedUser: { ...user, isRead: 0 },
    });
  },
}));
