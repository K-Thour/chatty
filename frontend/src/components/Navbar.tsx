import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Search,
  UserPlus,
  Send,
  Inbox,
} from "lucide-react";
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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPersons, setSearchedPersons] = useState<
    { id: string; name: string }[]
  >([]);
  const [showRequestsMenu, setShowRequestsMenu] = useState(false);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);

  const {
    notifications,
    notificationsCount,
    subscribeToNotifications,
    unsubscribeToNotifications,
    resetNotificationsCount,
  } = useNotificationStore() as {
    notifications: NotificationDataType[];
    notificationsCount: number;
    subscribeToNotifications: () => {};
    unsubscribeToNotifications: () => {};
    resetNotificationsCount: () => {};
  };

   useEffect(() => {
    subscribeToNotifications();
    () => unsubscribeToNotifications();
  }, []);

  // Example: mock API call or filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchedPersons([]);
      return;
    }

    // mock results (replace with API fetch)
    const mockUsers = [
      { id: "1", name: "Karanveer Singh" },
      { id: "2", name: "Aman Sharma" },
      { id: "3", name: "Harpreet Kaur" },
    ];

    const filtered = mockUsers.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchedPersons(filtered);
  }, [searchQuery]);

  const handleNotification = () => {
    setDisplayNotifications((prev) => {
      const newState = !prev;
      if (newState) resetNotificationsCount();
      return newState;
    });
  };

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);
    setSearchQuery("");
    setSearchedPersons([]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSendRequest = (id: string) => {
    console.log("Send friend request to:", id);
    // call API here
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16 relative">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
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

          <div className="flex items-center gap-2 relative">
            {/* Search Toggle Button */}
            <button
              className="btn btn-sm gap-2 relative"
              onClick={handleSearchToggle}
            >
              <Search className="size-5" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Search Input (visible only when toggled) */}
            {showSearch && (
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Find friends..."
                  className="input input-sm input-bordered w-48 sm:w-64 transition-all"
                />

                {/* Dropdown results */}
                {searchedPersons.length > 0 && (
                  <div className="absolute mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchedPersons.map((person) => (
                      <div
                        key={person.id}
                        className="flex justify-between items-center px-3 py-2 hover:bg-base-200 cursor-pointer"
                      >
                        <span>{person.name}</span>
                        <button
                          onClick={() => handleSendRequest(person.id)}
                          className="btn btn-xs btn-primary gap-1"
                        >
                          <UserPlus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link
              to={"/settings"}
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="btn btn-sm gap-2 relative"
                  onClick={handleNotification}
                >
                  <MessageSquare className="size-5" />
                  <span className="hidden sm:inline">Notifications</span>
                  {notificationsCount > 0 && (
                    <span
                      className="
                        absolute -top-1 -right-1
                        bg-amber-400 rounded-full text-black 
                        w-5 h-5 flex justify-center items-center text-xs font-bold
                      "
                    >
                      {notificationsCount}
                    </span>
                  )}
                </button>

                {displayNotifications && (
                  <NotificationDropdown
                    notifications={notifications}
                    setDisplayNotifications={setDisplayNotifications}
                  />
                )}

                {/* Requests Menu */}
                <button
                  className="btn btn-sm gap-2 relative"
                  onClick={() => setShowRequestsMenu((prev) => !prev)}
                >
                  <Inbox className="w-5 h-5" />
                  <span className="hidden sm:inline">Requests</span>
                </button>

                {showRequestsMenu && (
                  <div className="absolute top-14 right-0 bg-white shadow-lg rounded-lg p-3 w-72">
                    <h3 className="font-bold mb-2">Sent Requests</h3>
                    {sentRequests.length > 0 ? (
                      sentRequests.map((r) => (
                        <div key={r.id} className="flex items-center gap-2 p-1">
                          <Send className="w-4 h-4 text-blue-500" />
                          <span>{r.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No sent requests</p>
                    )}

                    <h3 className="font-bold mt-3 mb-2">Received Requests</h3>
                    {receivedRequests.length > 0 ? (
                      receivedRequests.map((r) => (
                        <div key={r.id} className="flex items-center gap-2 p-1">
                          <User className="w-4 h-4 text-green-500" />
                          <span>{r.name}</span>
                          <button className="btn btn-xs btn-success ml-auto">
                            Accept
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No received requests
                      </p>
                    )}
                  </div>
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
