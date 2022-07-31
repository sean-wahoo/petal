import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addLocale(en);

/**
 * Returns a string representing a timestamp in past tense with different units
 *
 * @param isoDate Date to format as an ISO timestamp
 *
 * @returns string representing a timestamp in past tense with different units
 *
 */
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

/**
 * Returns current URL based on node environment ('development' or 'production')
 */
export const getApiUrl = () => {
  const dev = process.env.NODE_ENV !== "production";
  return dev
    ? process.env.NEXT_PUBLIC_DEV_ROOT_API_URL
    : process.env.NEXT_PUBLIC_RAILWAY_STATIC_URL
    ? `https://${process.env.NEXT_PUBLIC_RAILWAY_STATIC_URL}`
    : "http://localhost:3000";
};

/**
 * Tells static page to manually revalidate and regenerate with any updated content
 *
 * @param path Path of page to revalidate
 *
 */
export const revalidate = async (path: string) => {
  await fetch(
    `${getApiUrl()}/api/revalidate?secret=${
      process.env.NEXT_PUBLIC_REVALIDATION_SECRET
    }&path=${path}`,
    {
      method: "GET",
    }
  );
  return;
};
