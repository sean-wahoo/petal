import Cookies from "universal-cookie";
import { decodeSessionToken, encodeSessionToken } from "lib/session";
import { SessionData } from "lib/types";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid/async";

/**
 * Retrieves current session data and function to update the session
 *
 * @returns Session object and function to update session 
 *
 */
const useSession = () => {
  const [session, setSession] = useState<SessionData>()
  let session_token: string = "";
  useEffect(() => {
    const cookies = new Cookies();
    session_token = cookies.get("session_token");
    decodeSessionToken(session_token).then(payload => setSession(payload));
  }, [session_token])
  try {
    const updateSession = async (newSession: SessionData) => {
      const newCacheKey = await nanoid(11);
      newSession.cache_key = newCacheKey;
      const stringifiedSession = JSON.stringify(newSession);
      let redisReturnedUpdateData = await fetch(
        `${process.env.NEXT_PUBLIC_REDIS_API_URL}/hmset/${session?.user_id}/session_data`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_REDIS_API_TOKEN}`,
          },
          body: JSON.stringify(stringifiedSession),
        }
      );
      let responseForSettingExpiration = await fetch(
        `${process.env.NEXT_PUBLIC_REDIS_API_URL}/expire/${session?.user_id}/84600`,
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
      const newSessionToken = await encodeSessionToken(newSession);
      const cookies = new Cookies();
      cookies.set("session_token", newSessionToken, { path: '/' });
      setSession(newSession)
      return newSession.cache_key;
    }
    return { session, updateSession };
  } catch (e: any) {
    console.error(e);
    return { session: undefined, updateSession: (_: any) => { } }
  }
};

export { useSession };
