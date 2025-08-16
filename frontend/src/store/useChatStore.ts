import { create } from "zustand";
import { getMessages, getUsers, sendMessage } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  seletedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const users = await getUsers();
      set({ users: users.users });
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error?.response?.data?.message || "Unable to get users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const messages = await getMessages(userId);
      console.log("Fetched messages: ----> 27", messages);
      set({ messages: messages.messages });
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
      console.log("message is:--->", message);
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
    set({ selectedUser: user });
  },
}));
