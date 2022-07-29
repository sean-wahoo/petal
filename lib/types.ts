import { JSONContent } from "@tiptap/react";
interface Success {
  user_id: string;
  session_id?: string;
}

interface Error {
  is_error: boolean;
  error_code: string;
  error_message: string;
}

interface AuthData {
  email: string;
  password: string;
}

interface SessionData {
  user_id: string;
  email: string;
  cache_key?: string;
  been_welcomed: boolean;
  display_name: string;
  image_url: string;
}

interface RateProps {
  rateId: string;
  rateKind: string;
  userRateId: string;
}

interface PostProps {
  postId: string;
  author: {
    id: string;
    name: string;
  };
  title: string;
  content: object;
  ups: number;
  downs: number;
  createdAt: string;
  updatedAt: string;
  ratedPost: RateProps[];
}

interface CommentProps {
  commentId: string;
  parentId: string;
  author: {
    id: string;
    name: string;
  };
  ups: number;
  downs: number;
  content: object;
  createdAt: string;
  replies: CommentProps[];
  ratedComment: RateProps[];
}

interface PostPageProps {
  post_id: string;
  post: PostProps;
  comments?: CommentProps[];
}

interface RegisterSuccess extends Success {
  type: string;
  been_welcomed: boolean;
}

interface RegisterError extends Error {
  type: string;
}

interface RegisterResponse
  extends RegisterSuccess,
    RegisterError,
    SessionData {}

interface LoginSuccess extends Success {
  type: string;
  been_welcomed: boolean;
}

interface LoginError extends Error {
  type: string;
}

interface LoginResponse extends LoginSuccess, LoginError, SessionData {}

interface SessionSuccess extends Success, SessionData {
  display_name: string;
  session_id: string;
  image_url: string;
  email: string;
}

interface SessionError extends Error {}

interface LogoutData {
  user_id: string;
  session_id: string;
}

interface LogoutSuccess extends Success {}

interface LogoutError extends Error {}

// props
interface ErrorMessageProps {
  error_message: string;
  type?: string;
}

interface LayoutProps {
  children: any;
  title: string;
  is_auth: boolean;
  session?: SessionData;
  showNavbar?: boolean;
}
interface ProfileProps {
  session: {
    id: string;
    name: string;
    image: string;
  };
}
interface ProfileDataProps {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  dateOfBirth: string;
  description: string;
}
interface FriendProps {
  friendId: string;
  sender: ProfileDataProps;
  recipient: ProfileDataProps;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfilePageProps {
  profile_data: ProfileDataProps;
  friends_data: FriendProps[];
}

interface EditorProps {
  updateEditorContent: (json: JSONContent) => void;
  label: String;
  type?: string;
  parent_id?: string;
}

interface ProfileDataSuccess extends Success {}
interface ProfileDataError extends Error {}

interface ProfileDataResponse extends ProfileDataSuccess, ProfileDataError {}

interface FriendDataSuccess extends Success {}
interface FriendDataError extends Error {}

interface FriendDataResponse extends FriendDataSuccess, FriendDataError {}

interface RateButtonsProps {
  postId?: string;
  commentId?: string;
  rateInfo: RateProps[];
  id: string;
}

export type {
  RegisterSuccess,
  RegisterError,
  RegisterResponse,
  LoginResponse,
  SessionSuccess,
  SessionError,
  AuthData,
  LogoutSuccess,
  LogoutData,
  SessionData,
  LogoutError,
  ErrorMessageProps,
  LayoutProps,
  ProfileProps,
  ProfilePageProps,
  ProfileDataResponse,
  EditorProps,
  PostProps,
  PostPageProps,
  RateButtonsProps,
  CommentProps,
  RateProps,
  FriendDataResponse,
};
