import { Trash2, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import { useState } from "react";
import DeleteModal from "./modals/DeleteModal";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser }: any = useChatStore();
  const { onlineUsers }: any = useAuthStore();
  const { removeFriend, getFriends } = useFriendStore();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleDeleteModal = () => {
    setIsDeleteModalOpen((prev) => !prev);
  };
  const handleRemoveFriend = async (id: string) => {
    await removeFriend(id);
    setSelectedUser(null);
    await getFriends();
  };
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePicture || "/avatar.png"}
                alt={selectedUser.name}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser.id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ">
          <button
            className="p-1 rounded-md hover:bg-base-200 active:bg-base-300"
            onClick={() => handleDeleteModal()}
          >
            <Trash2 className="hover:text-red-500" />
          </button>

          {/* Close button */}
          <button
            className="p-1 rounded-md hover:bg-base-200 active:bg-base-300"
            onClick={() => setSelectedUser(null)}
          >
            <X className="hover:text-red-300" />
          </button>
        </div>
        {isDeleteModalOpen && (
          <DeleteModal
            name={selectedUser.name}
            onDelete={() => handleRemoveFriend(selectedUser.id)}
            onCancel={handleDeleteModal}
          />
        )}
      </div>
    </div>
  );
};
export default ChatHeader;
