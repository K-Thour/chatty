export type RequestStatus = "accepted" | "pending" | "rejected";

export interface authUserDataType {
  email: string;
  id: string;
  name: string;
}

export interface userDataType {
  createdAt: string;
  description: string;
  email: string;
  id: string;
  name: string;
  profilePicture: string;
  unreadCount: number;
}

export interface messageDataType {
  createdAt: string;
  id: string;
  image?: string;
  message?: string;
  receiverId: string;
  senderId: string;
  isRead: boolean;
}

export interface getProfileDataType {
  data: {
    user: userDataType;
  };
}

export interface authDataType {
  data: {
    message: string;
    token: string;
    user: authUserDataType;
  };
}

export interface logoutDataType {
  data: {
    message: string;
  };
}

export interface getUsersDataType {
  data:userDataType[]
}

export interface updateProfileDataType {
  data: {
    message: string;
    user: userDataType;
  };
}

export interface getMessagesDataType {
  data: {
    message: string;
    messages: messageDataType[];
  };
}

export interface sendMessageDataType {
  data: {
    message: string;
    messageData: messageDataType;
  };
}

export interface NotificationDataType {
  userId: string;
  text: string;
  time: string;
}

export interface Request {
  id: string;
  name: string;
  imageUrl: string;
}

export interface SearchUser {
  id: string;
  name: string;
  imageUrl: string;
}

export interface SendRequestBody{
  status:RequestStatus
}
