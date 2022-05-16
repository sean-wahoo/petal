import { nanoid } from "nanoid/async";
import type { SessionSuccess, SessionError, SessionData } from "lib/types";
import Cookies from "universal-cookie";
import axios from "axios";

const updateSessionWithSessionId = async (
  session_id: string,
  session_addition: Object
): Promise<Response | SessionError> => {
  try {
    let all = await fetch(
      `${process.env.NEXT_PUBLIC_REDIS_API_URL}/hgetall/${session_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
        },
      }
    );

    const allParsed = await all.json();

    let data = await fetch(
      `${process.env.NEXT_PUBLIC_REDIS_API_URL}/hmset/${session_id}/session_data`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
        },
        body: JSON.stringify({ ...allParsed, ...session_addition }),
      }
    );
    data = await data.json();

    let exp = await fetch(
      `${process.env.NEXT_PUBLIC_REDIS_API_URL}/expire/${session_id}/84600`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
        },
      }
    );
    exp = await exp.json();

    if ("error" in data || "error" in exp)
      throw new Error("Session failed to initialize!");

    return exp;
  } catch (e: any) {
    return { is_error: true, error_code: e.code, error_message: e.message };
  }
};

const updateSession = async (
  session_data: SessionData
): Promise<string | SessionError> => {
  try {
    let { user_id, email, session_id, image_url, display_name } = session_data;
    session_id ||= await nanoid(24);
    const obj: any = { user_id, email, image_url, display_name };

    let data = await fetch(
      `${process.env.NEXT_PUBLIC_REDIS_API_URL}/hmset/${session_id}/session_data`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
        },
        body: JSON.stringify(obj),
      }
    );
    data = await data.json();

    let exp = await fetch(
      `${process.env.NEXT_PUBLIC_REDIS_API_URL}/expire/${session_id}/84600`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
        },
      }
    );
    exp = await exp.json();

    if ("error" in data || "error" in exp)
      throw {
        code: "session-failed",
        message: "Session Failed to Initialize!",
      };

    return session_id;
  } catch (e: any) {
    return { is_error: true, error_code: e.code, error_message: e.message };
  }
};

const getSession = async (
  session_id: string
): Promise<SessionSuccess | SessionError> => {
  let all = await fetch(
    `${process.env.NEXT_PUBLIC_REDIS_API_URL}/hgetall/${session_id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
      },
    }
  );

  const allParsed = await all.json();

  if (allParsed.result.length === 0)
    return {
      is_error: true,
      error_code: "invalid-session-id",
      error_message: "Invalid Session ID!",
    };

  const obj = {
    ...JSON.parse(allParsed.result[1]),
    session_id,
    is_error: false,
  };

  return obj;
};

const destroySession = async (session_id: string): Promise<void> => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_REDIS_API_URL}/del/${session_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
        },
        body: JSON.stringify({ session_id }),
      }
    );
  } catch (e: any) {
    console.log({ e });
  }
};

const session_handler = async (
  session_id: string | undefined
): Promise<SessionSuccess | SessionError> => {
  if (session_id === undefined || session_id.length < 1)
    throw { message: "No Session Cookie!", code: "no-session-cookie" };

  const session_data: SessionSuccess | SessionError = await getSession(
    session_id
  );

  if (
    "is_error" in session_data &&
    session_data.error_message === "Invalid Session ID!"
  ) {
    const dev = process.env.NODE_ENV !== "production";

    await fetch(
      `${dev ? "http://localhost:3000" : null}/api/auth/destroySession`,
      {
        method: "POST",
        body: JSON.stringify({ session_id }),
      }
    );
    const cookies = new Cookies();
    cookies.remove("session_id");
    throw {
      message: "Invalid Session ID!",
      code: "invalid-session-id",
    };
  }

  return session_data;
};
export { updateSession, getSession, destroySession, session_handler };
