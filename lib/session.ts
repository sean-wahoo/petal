import type { SessionData } from "lib/types";
import { getApiUrl } from "lib/utils";
import * as jose from "jose";

/**
 * Returns a user's session payload as a JWT string.
 * @param session JSON object representing a user's session
 *
 * @returns String representing session as JWT
 *
 */
const encodeSessionToken: (session: SessionData) => Promise<string> = async (
  session: SessionData
) => {
  const key = process.env.NEXT_PUBLIC_JWT_SIGNING_KEY as string;
  const token = await new jose.SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(key));
  return token;
};

/**
 * Returns a JSON object representing a user's session
 * @param token String representing session as JWT
 *
 * @returns JSON object representing a user's session
 */
const decodeSessionToken: (token: string) => Promise<SessionData> = async (
  token: string
) => {
  try {
    const key = process.env.NEXT_PUBLIC_JWT_SIGNING_KEY as string;
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(key)
    );
    return payload;
  } catch (e: any) {
    console.error({ e });
    return e;
  }
};

/**
 *
 * Updates user's session data in Redis
 *
 * @param session_data JSON object containing user's session data
 *
 * @returns Cache key for the user
 *
 *
 */
const updateSessionDataRedis = async (session_data: SessionData) => {
  const stringifiedSession = JSON.stringify(session_data);
  let redisReturnedUpdateData = await fetch(
    `${process.env.NEXT_PUBLIC_REDIS_API_URL}/hmset/${session_data.user_id}/session_data`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
      },
      body: JSON.stringify(stringifiedSession),
    }
  );
  let responseForSettingExpiration = await fetch(
    `${process.env.NEXT_PUBLIC_REDIS_API_URL}/expire/${session_data.user_id}/84600`,
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
  return session_data.cache_key;
};

/**
 * checks to see if the session on the client is up to date with
 * the session in redis
 *
 * @param session_token JSON object representing a user's session
 * @returns whether or not the client cache key is up to date with the one stored on redis
 */
const isSessionValid = async (session_token: SessionData) => {
  const { user_id, cache_key } = session_token;
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

/**
 * Fetches session from MySQL storage and returns encoded JWT
 * @param user_id User's ID
 * @returns JWT token containing user's session data
 */
const syncSession = async (user_id: string) => {
  let data: any = await fetch(
    `${getApiUrl()}/api/users/get-user?user_id=${user_id}`
  );
  data = await data.json();
  const token = encodeSessionToken(data as SessionData);
  return token;
};

const destroySession = async (session_id: string): Promise<void> => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_REDIS_API_URL}/del/${session_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
      },
      body: JSON.stringify({ session_id }),
    });
  } catch (e: any) {
    console.error({ e });
  }
};

export {
  destroySession,
  encodeSessionToken,
  decodeSessionToken,
  updateSessionDataRedis,
  isSessionValid,
  syncSession,
};
