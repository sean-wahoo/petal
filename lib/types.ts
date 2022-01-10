interface Success {
  user_id: string
  session_id: string
}

interface Error {
  is_error: boolean
  error_code: string
  error_message: string
}

interface AuthData {
  email: string
  password: string
}

interface SessionData {
  user_id: string
  email: string
  session_id?: string
}

interface SessionProps {
  session: {
    user_id: string
    email: string
    session_id: string
  }
}

interface RegisterSuccess extends Success {
  type: string
}

interface RegisterError extends Error {
  type: string
}

interface LoginSuccess extends Success {
  type: string
}

interface LoginError extends Error {
  type: string
}

interface SessionSuccess extends Success {
  email: string
}

interface SessionError extends Error {}

interface LogoutData {
  user_id: string
  session_id: string
}

interface LogoutSuccess extends Success {}

interface LogoutError extends Error {}

// props
interface ErrorMessageProps {
  error_message: string
  type?: string
}

interface LayoutProps {
  children: any
  title: string
}

export type {
  SessionProps,
  RegisterSuccess,
  RegisterError,
  LoginSuccess,
  LoginError,
  SessionSuccess,
  SessionError,
  AuthData,
  LogoutSuccess,
  LogoutData,
  SessionData,
  LogoutError,
  ErrorMessageProps,
  LayoutProps,
}
