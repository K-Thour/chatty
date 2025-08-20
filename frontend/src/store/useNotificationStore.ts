import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import type {
  authUserDataType,
  messageDataType,
  NotificationDataType,
  userDataType,
} from "../types.js";
import { useChatStore } from "./useChatStore";
import { formatMessageTime } from "../lib/utils.js";

export const useNotificationStore = create((set, get) => ({
  notifications: [] as NotificationDataType[],
  notificationsCount: 0 as number,
  subscribeToNotifications: () => {
    const { authUser, socket } = useAuthStore.getState() as {
      authUser: authUserDataType;
      socket: any;
    };
    if (!authUser) return;
    socket.on("newMessage", async (message: messageDataType) => {
      const { notifications, notificationsCount } = get() as {
        notifications: NotificationDataType[];
        notificationsCount: number;
      };
      const { users } = useChatStore() as { users: userDataType[] };
      let senderName;
      users.map((user) => {
        if (user.id === message.senderId) {
          senderName = user.name;
        }
      });
      const newNotification: NotificationDataType = {
        userId: message.senderId,
        text: `New message recieved from ${senderName}`,
        time: formatMessageTime(message.createdAt),
      };
      set({
        notifications: [...notifications, newNotification],
        notificationsCount: notificationsCount + 1,
      });
    });
  },
  unSubscribeFromNotifications: () => {
    const { socket }: any = useAuthStore.getState();
    socket.off("newMessage");
  },
}));
