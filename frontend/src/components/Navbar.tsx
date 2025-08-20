import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useNotificationStore } from "../store/useNotificationStore";
import type { authUserDataType, NotificationDataType } from "../types.js";

const Navbar = () => {
  const { logout, authUser } = useAuthStore() as {
    logout: () => {};
    authUser: authUserDataType;
  };
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const {
    notifications,
    notificationsCount,
    subscribeToNotifications,
    unsubscribeToNotifications,
  } = useNotificationStore() as {
    notifications: NotificationDataType[];
    notificationsCount: number;
    subscribeToNotifications: () => {};
    unsubscribeToNotifications: () => {};
  };

  useEffect(() => {
    subscribeToNotifications();
    () => unsubscribeToNotifications();
  }, []);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16  ">
        <div className="flex items-center justify-between h-full  ">
          <div className="flex items-center gap-8  ">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className={`btn btn-sm gap-2`}
                  onClick={() => setDisplayNotifications((prev) => !prev)}
                >
                  <MessageSquare className="size-5" />
                  <span className="hidden sm:inline">Notifications</span>
                  {notificationsCount>0 && <span className="bg-amber-400 rounded-full w-4 h-4 flex justify-center items-center absolute top-4 right-46">
                    {notificationsCount}
                  </span>}
                </button>

                {displayNotifications && (
                  <NotificationDropdown
                    notifications={notifications}
                    setDisplayNotifications={setDisplayNotifications}
                  />
                )}

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
