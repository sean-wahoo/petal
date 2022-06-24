import type { SessionSuccess, SessionError, SessionData } from "lib/types";
import Cookies from "universal-cookie";
import axios from "axios";
import { getApiUrl } from "lib/utils";
import jwt from "jsonwebtoken";

const encodeSessionToken = (session: SessionData) => {
  const key = process.env.NEXT_PUBLIC_JWT_SIGNING_KEY as string;
  const token = jwt.sign(session, key);
  return token;
};

const decodeSessionToken: (token: string) => SessionData = (token: string) => {
  const key = process.env.NEXT_PUBLIC_JWT_SIGNING_KEY as string;
  const session = jwt.verify(token, key);
  return session as SessionData;
};

const updateSessionDataRedis = async (session_payload: SessionData) => {
  const stringifiedSession = JSON.stringify(session_payload);
  let redisReturnedUpdateData = await fetch(
    `${process.env.NEXT_PUBLIC_REDIS_API_URL}/hmset/${session_payload.user_id}/session_data`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
      },
      body: JSON.stringify(stringifiedSession),
    }
  );
  let responseForSettingExpiration = await fetch(
    `${process.env.NEXT_PUBLIC_REDIS_API_URL}/expire/${session_payload.user_id}/84600`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
      },
    }
  );
  responseForSettingExpiration = await responseForSettingExpiration.json();
  redisReturnedUpdateData = await redisReturnedUpdateData.json();
  if (
    "error" in redisReturnedUpdateData ||
    "error" in responseForSettingExpiration
  )
    throw {
      code: "session-failed",
      message: "Session Failed to Initialize!",
    };
  return session_payload.cache_key;
};

const isSessionValid = async (session_payload: SessionData) => {
  const { user_id, cache_key } = session_payload;
  let data = await fetch(
    `${process.env.NEXT_PUBLIC_REDIS_API_URL}/hgetall/${user_id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
      },
    }
  );
  const parsed = await data.json();
  if (parsed.result.length === 0)
    throw {
      code: "invalid-session-id",
      message: "Invalid Session ID!",
    };

  const obj = JSON.parse(JSON.parse(parsed.result[1]));
  return cache_key === obj.cache_key;
};

const syncSession = async (user_id: string) => {
  let data: any = await fetch(
    `${getApiUrl()}/api/users/get-user?user_id=${user_id}`
  );
  data = await data.json();
  const token = encodeSessionToken(data as SessionData);
  return token;
};

// const updateSession = async (
//   session_data: SessionData
// ): Promise<string | SessionError> => {
//   try {
//     let { user_id, email, session_id, image_url, display_name } = session_data;
//     session_id ||= await nanoid(24);
//     const obj: any = { user_id, email, image_url, display_name };
//     obj.cacheKey = nanoid(12);

//     let data = await fetch(
//       `${process.env.NEXT_PUBLIC_REDIS_API_URL}/hmset/${session_id}/session_data`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
//         },
//         body: JSON.stringify(obj),
//       }
//     );
//     data = await data.json();

//     let exp = await fetch(
//       `${process.env.NEXT_PUBLIC_REDIS_API_URL}/expire/${session_id}/84600`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
//         },
//       }
//     );
//     exp = await exp.json();

//     if ("error" in data || "error" in exp)
//       throw {
//         code: "session-failed",
//         message: "Session Failed to Initialize!",
//       };

//     return session_id;
//   } catch (e: any) {
//     return { is_error: true, error_code: e.code, error_message: e.message };
//   }
// };

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
    console.error({ e });
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
    await fetch(`${getApiUrl()}/api/auth/destroySession`, {
      method: "POST",
      body: JSON.stringify({ session_id }),
    });
    const cookies = new Cookies();
    cookies.remove("session_id");
    throw {
      message: "Invalid Session ID!",
      code: "invalid-session-id",
    };
  }

  return session_data;
};
export {
  // updateSession,
  getSession,
  destroySession,
  session_handler,
  encodeSessionToken,
  decodeSessionToken,
  updateSessionDataRedis,
  isSessionValid,
  syncSession,
};
