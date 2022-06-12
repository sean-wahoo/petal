import type { LogoutSuccess, LogoutError } from "lib/types";
import { destroySession, session_handler } from "lib/session";
import Cookies from "universal-cookie";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { GetServerSidePropsContext } from "next";

TimeAgo.addLocale(en);

export const logout = async (
  session_id: string,
  user_id: string
): Promise<LogoutSuccess | LogoutError> => {
  try {
    await fetch("/api/auth/logout", {
      method: "PUT",
      body: JSON.stringify({ user_id, session_id }),
    });

    await destroySession(session_id);
    const cookies = new Cookies();
    cookies.remove("session_id");

    return { user_id, session_id } as LogoutSuccess;
  } catch (e: any) {
    return {
      is_error: true,
      error_code: e.code,
      error_message: e.message,
    } as LogoutError;
  }
};

export const session_check = async (): Promise<any> => {
  try {
    const cookies = new Cookies();
    const session_id = cookies.get("session_id");
    const session = await session_handler(session_id);
    return [session, null];
  } catch ({ message, code }: any) {
    console.log({ message, code });
  }
};

export const getFormattedTimestamp = (isoDate: string) => {
  const date = new Date(isoDate);
  const currentDate = new Date();
  const diff = currentDate.getTime() - date.getTime();
  const diffDays = diff / (1000 * 3600 * 24);

  if (diffDays < 7) {
    const timeAgo = new TimeAgo("en-US");
    return timeAgo.format(date);
  }
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-us", options as any);
};

export const getApiUrl = () => {
  const dev = process.env.NODE_ENV !== "production";
  return dev
    ? process.env.NEXT_PUBLIC_DEV_ROOT_API_URL
    : process.env.NEXT_PUBLIC_PROD_ROOT_API_URL;
};

export const handleMiddlewareErrors: any = (
  code: string,
  context: GetServerSidePropsContext
) => {
  console.log({ code });
  switch (code) {
    case "user-not-found": {
      return {
        notFound: true,
      };
    }
    case "invalid-session-id": {
      context.res.setHeader("Set-Cookie", ["session_id=deleted; Max-Age=0"]);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    default: {
      return {
        notFound: true,
      };
    }
  }
};
