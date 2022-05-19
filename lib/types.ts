import { JSONContent } from "@tiptap/react";
interface Success {
  user_id: string;
  session_id: string;
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
  session_id?: string;
  display_name: string;
  image_url: string;
}

interface SessionProps {
  session: SessionData;
}

interface RegisterSuccess extends Success {
  type: string;
}

interface RegisterError extends Error {
  type: string;
}

interface RegisterResponse extends RegisterSuccess, RegisterError {}

interface LoginSuccess extends Success {
  type: string;
}

interface LoginError extends Error {
  type: string;
}

interface LoginResponse extends LoginSuccess, LoginError {}

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
  session_data?: SessionData;
  showNavbar?: boolean;
}
interface ProfileProps {
  profile: {
    user_id: string;
    display_name: string;
    image_url: string;
  };
}

interface ProfilePageProps extends SessionProps {
  profile_data: {
    user_id: string;
    display_name: string;
    email: string;
    created_at: string;
    updated_at: string;
    image_url: string;
    date_of_birth: string;
    tagline: string;
  };
}

interface CreatePostPageProps extends SessionProps {}

interface EditorProps {
  updateEditorContent: (json: JSONContent) => void;
  label: String;
}

interface ProfileDataSuccess extends Success {}
interface ProfileDataError extends Error {}

interface ProfileDataResponse extends ProfileDataSuccess, ProfileDataError {}

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
};
