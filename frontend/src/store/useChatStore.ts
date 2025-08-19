import { create } from "zustand";
import { getMessages, getUsers, sendMessage } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import type {
  authUserDataType,
  messageDataType,
  userDataType,
} from "../types.js";

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

  subscribeToMessages: () => {
    const { selectedUser } = get() as {
      selectedUser?: userDataType;
    };

    if (!selectedUser) return;

    const { socket } = useAuthStore.getState() as {
      socket: any;
    };

    socket.on("newMessage", async (message: messageDataType) => {
      const { selectedUser, messages } = get() as {
        selectedUser: userDataType;
        messages: messageDataType[];
      };
      await getMessages(selectedUser?.id);
      set({
        messages:
          selectedUser?.id === message.senderId
            ? [...messages, message]
            : messages,
      });
    });
  },

  unsubscribeFromMessages: () => {
    const { socket }: any = useAuthStore.getState();
    socket.off("newMessage");
  },

  subscribeToUnreadCount: () => {
    const { authUser, socket } = useAuthStore.getState() as {
      authUser: authUserDataType;
      socket: any;
    };

    if (!authUser) return;

    socket.on("newMessage", (message: messageDataType) => {
      set((state: any) => {
        const { selectedUser, users } = state;

        const updatedUsers = users.map((user: userDataType) => {
          if (
            user.id === message.senderId &&
            selectedUser?.id !== message.senderId // not the open chat
          ) {
            return { ...user, unreadCount: (user.unreadCount ?? 0) + 1 };
          }
          return user;
        });

        return { users: updatedUsers };
      });
    });
  },

  unsubscribeFromUnreadCount: () => {
    const { socket }: any = useAuthStore.getState();
    socket.off("newMessage");
  },

  setSelectedUser: (user: userDataType) => {
    if (!user) {
      set({ selectedUser: user });
      return;
    }
    set({
      selectedUser: { ...user, isRead: 0 },
    });
  },
}));
