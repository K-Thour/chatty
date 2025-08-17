import { Camera, Check, Edit, Mail, User, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile }: any = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(
    authUser.user.profilePicture || ""
  );
  const [isUpdatingProfilePic, setIsUpdatingProfilePic] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
  const [name, setName] = useState(authUser.user.name);
  const [description, setDescription] = useState(authUser.user.description);
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image: any = reader.result;
      setSelectedImg(base64Image);
      setIsUpdatingProfilePic(true);
      const updatedUser = await updateProfile({ profilePicture: base64Image });
      setIsUpdatingProfilePic(false);
      setSelectedImg(updatedUser.user.profilePicture);
    };
  };
  const handleUpdateProfile = async (updates: any) => {
    await updateProfile(updates);
    setIsUpdatingName(false);
    setIsUpdatingDescription(false);
  };
  
  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  isUpdatingProfilePic
                    ? "/updatingProfilePic.gif"
                    : selectedImg || "/avatar.png"
                }
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>

              {isUpdatingName ? (
                <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex items-center justify-between">
                  <input
                    type="text"
                    value={name}
                    className="bg-transparent outline-none flex-1"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsUpdatingName(false)}
                      className="p-1.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateProfile({ name })}
                      className="p-1.5 rounded-full bg-green-100 text-green-500 hover:bg-green-200 transition"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex items-center justify-between">
                  <input
                    type="text"
                    defaultValue={authUser?.user?.name}
                    className="bg-transparent outline-none flex-1"
                    disabled
                  />
                  <button
                    onClick={() => setIsUpdatingName(true)}
                    className="p-1.5 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                description
              </div>

              {isUpdatingDescription ? (
                <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex items-center justify-between">
                  <input
                    type="text"
                    value={description}
                    className="bg-transparent outline-none flex-1"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsUpdatingDescription(false)}
                      className="p-1.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateProfile({ description })}
                      className="p-1.5 rounded-full bg-green-100 text-green-500 hover:bg-green-200 transition"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex items-center justify-between">
                  <input
                    type="text"
                    defaultValue={authUser?.user?.description}
                    className="bg-transparent outline-none flex-1"
                    disabled
                  />
                  <button
                    onClick={() => setIsUpdatingDescription(true)}
                    className="p-1.5 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.user?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.user?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
