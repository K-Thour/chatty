import { Bell } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import type { NotificationDataType, userDataType } from "../types.js";

interface notoficationDropDownInterface{
  notifications:NotificationDataType[],
  setDisplayNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationDropdown = ({notifications,setDisplayNotifications}:notoficationDropDownInterface) => {
  const { setSelectedUser, users } = useChatStore() as {
    setSelectedUser: (user: userDataType) => {};
    users: userDataType[];
  };

  const handleNotificationRedriction = (userId: string) => {
    users.map((user) => {
      if (user.id === userId) {
        setSelectedUser(user);
      }
    });
    setDisplayNotifications((prev)=>!prev)
  };
  return (
    <div className="absolute top-15 right-35 w-72 bg-base-100 shadow-lg rounded-xl border border-base-300 overflow-hidden">
      <div className="px-4 py-2 border-b border-base-300 flex items-center justify-between">
        <span className="font-semibold text-sm">Notifications</span>
        <Bell className="w-4 h-4 text-primary" />
      </div>

      <div className="max-h-64 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((n:NotificationDataType) => (
            <div
              onClick={() => handleNotificationRedriction(n.userId)}
              key={n.userId}
              className="px-4 py-3 hover:bg-base-200 transition-colors cursor-pointer"
            >
              <p className="text-sm">{n.text}</p>
              <span className="text-xs text-gray-500">{n.time}</span>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-gray-500">
            No notifications
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
