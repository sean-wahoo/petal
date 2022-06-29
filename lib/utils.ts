import type { LogoutSuccess } from "lib/types";
import { destroySession } from "lib/session";
import Cookies from "universal-cookie";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import axios from "axios";

TimeAgo.addLocale(en);

export const logout = async (
  user_id: string
): Promise<LogoutSuccess> => {
  const cookies = new Cookies();
  const session_token = cookies.get('session_token')
  await destroySession(session_token);
  cookies.remove("session_token");

  return { user_id } as LogoutSuccess;
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

export const revalidate = async (path: string) => {
  await axios.get(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATION_SECRET}&path=${path}`);
  return;
}

