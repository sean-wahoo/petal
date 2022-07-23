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

interface SessionProps {
  session?: SessionData;
}

interface IndexProps extends SessionProps {
  posts: PostProps[];
}

interface RateProps {
  rate_id: string;
  rate_kind: string;
  user_rate_id: string;
}

interface PostProps {
  post_id: string;
  author: {
    user_id: string;
    display_name: string;
  };
  title: string;
  content: object;
  ups: number;
  downs: number;
  created_at: string;
  updated_at: string;
  rated_post: RateProps[];
}

interface CommentProps {
  comment_id: string;
  parent_id: string;
  author: {
    user_id: string;
    display_name: string;
  };
  ups: number;
  downs: number;
  content: object;
  created_at: string;
  replies: CommentProps[];
  rated_comment: RateProps[];
}

interface PostPageProps extends SessionProps {
  post_id: string;
  post?: PostProps;
  comments?: CommentProps[];
}

interface PostCardProps extends SessionProps {
  post?: PostProps;
  loading: boolean;
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
    user_id: string;
    display_name: string;
    image_url: string;
  };
}
interface ProfileDataProps {
  user_id: string;
  display_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  date_of_birth: string;
  tagline: string;
}
interface FriendProps {
  friend_id: string;
  sender: ProfileDataProps;
  recipient: ProfileDataProps;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ProfilePageProps extends SessionProps {
  profile_data: ProfileDataProps;
  friends_data: FriendProps[];
}

interface CreatePostPageProps extends SessionProps {}

interface CreateCommentProps extends SessionProps {
  parent_id: string;
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
  post_id?: string;
  comment_id?: string;
  rate_info: RateProps[];
  user_id: string;
}

export type {
  SessionProps,
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
  CreatePostPageProps,
  EditorProps,
  IndexProps,
  PostCardProps,
  PostProps,
  PostPageProps,
  RateButtonsProps,
  CreateCommentProps,
  CommentProps,
  RateProps,
  FriendDataResponse,
};
