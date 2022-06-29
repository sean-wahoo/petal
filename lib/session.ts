import type { SessionData } from "lib/types";
import axios from "axios";
import { getApiUrl } from "lib/utils";
import * as jose from 'jose'
const encodeSessionToken: (session: SessionData) => Promise<string> = async (session: SessionData) => {
  const key = process.env.NEXT_PUBLIC_JWT_SIGNING_KEY as string;
  const token = await new jose.SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(key));
  return token;
};

const decodeSessionToken: (token: string) => Promise<SessionData> = async (token: string) => {
  try {
    const key = process.env.NEXT_PUBLIC_JWT_SIGNING_KEY as string;
    const { payload } = await jose.jwtVerify(
        token, new TextEncoder().encode(key)
    );
    return payload
  }
  catch (e: any) {
    console.log({ e })
    return e
  }
};

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

export {
  destroySession,
  encodeSessionToken,
  decodeSessionToken,
  updateSessionDataRedis,
  isSessionValid,
  syncSession,
};
