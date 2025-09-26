import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Search,
  UserPlus,
  Inbox,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { useNotificationStore } from "../store/useNotificationStore";
import type {
  authUserDataType,
  NotificationDataType,
  Request,
  SendRequestBody,
} from "../types.js";
import { useChatStore, type ChatStore } from "../store/useChatStore.js";
import { useFriendStore, type FriendStore } from "../store/useFriendStore.js";
import Spinner from "./Loader/Loader.js";

const Navbar = () => {
  const { logout, authUser } = useAuthStore() as {
    logout: () => {};
    authUser: authUserDataType;
  };
  const [displayNotifications, setDisplayNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequestsMenu, setShowRequestsMenu] = useState(false);

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

  const { getUsers, users, resetUsers } = useChatStore() as ChatStore;

  const {
    sendRequest,
    getAllPending,
    sentPendingRequests,
    isRequestsLoading,
    receivedRequests,
    deleteSendRequest,
    getAllPendingReceivedRequests,
    handleRequest,
    getFriends,
  } = useFriendStore() as FriendStore;

  useEffect(() => {
    subscribeToNotifications();
    () => unsubscribeToNotifications();
  }, []);
  const fetchUsers = async (query: string) => {
    await getUsers(query);
  };
  // Example: mock API call or filter

  useEffect(() => {
    searchQuery.length ? fetchUsers(searchQuery) : resetUsers();
  }, [searchQuery]);

  const handleNotification = () => {
    setShowRequestsMenu(false);
    setDisplayNotifications((prev) => {
      const newState = !prev;
      if (newState) resetNotificationsCount();
      return newState;
    });
  };

  const handleShowRequestMenu = async () => {
    setDisplayNotifications(false);
    setShowRequestsMenu((prev) => !prev);
    if (!showRequestsMenu) {
      await Promise.all([getAllPending(), getAllPendingReceivedRequests()]);
    }
  };

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);
    setSearchQuery("");
    resetUsers();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSendRequest = async (id: string) => {
    await sendRequest(id);
  };

  const handleDeleteRequest = async (id: string) => {
    await deleteSendRequest(id);
    await getAllPending();
  };

  const handleReceivedRequest = async (id: string, status: boolean) => {
    const body: SendRequestBody = {
      status: "pending",
    };
    if (status) {
      body.status = "accepted";
    } else {
      body.status = "rejected";
    }
    await handleRequest(id, body);
    await getAllPendingReceivedRequests();
    if(status){
      await getFriends();
    }
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
                {users.length > 0 && (
                  <div className="absolute mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {users.map((person: any) => (
                      <div
                        key={person._id}
                        className="flex justify-between items-center px-3 py-2 hover:bg-base-200 cursor-pointer"
                      >
                        <img
                          src={person.profilePicture}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{person.name}</span>
                        <button
                          onClick={() => handleSendRequest(person._id)}
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
                  onClick={handleShowRequestMenu}
                >
                  <Inbox className="w-5 h-5" />
                  <span className="hidden sm:inline">Requests</span>
                </button>

                {showRequestsMenu && (
                  <div className="absolute top-14 right-0 bg-white shadow-lg rounded-lg p-3 w-72">
                    {isRequestsLoading && (
                      <Spinner
                        size={6}
                        color="green-500"
                        text="Loading requests..."
                      />
                    )}
                    <h3 className="font-bold mb-2">Sent Requests</h3>
                    {sentPendingRequests.length > 0 && !isRequestsLoading ? (
                      sentPendingRequests.map((r) => (
                        <div
                          key={r.friendId._id}
                          className="flex items-center gap-2 p-1"
                        >
                          <img
                            src={r.friendId.profilePicture}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{r.friendId.name}</span>
                          <button
                            className="btn btn-xs btn-secondary ml-auto"
                            onClick={() => handleDeleteRequest(r.friendId._id)}
                          >
                            Cancel
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No sent requests</p>
                    )}

                    <h3 className="font-bold mt-3 mb-2">Received Requests</h3>
                    {receivedRequests.length > 0 && !isRequestsLoading ? (
                      receivedRequests.map((r) => (
                        <div
                          key={r.friendId._id}
                          className="flex items-center gap-2 p-1"
                        >
                          <img
                            src={r.friendId.profilePicture}
                            className="w-6 h-6 rounded-full"
                          />
                          <span>{r.friendId.name}</span>
                          <button
                            className="btn btn-xs btn-success ml-auto"
                            onClick={() => handleReceivedRequest(r._id, true)}
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-xs btn-secondary ml-auto"
                            onClick={() => handleReceivedRequest(r._id, false)}
                          >
                            Reject
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
