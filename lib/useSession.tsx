import Cookies from "universal-cookie";
import { decodeSessionToken, encodeSessionToken } from "lib/session";
import { SessionData } from "lib/types";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid/async";

const useSession = () => {
  try {
    const [session, setSession] = useState<SessionData>()
    let session_payload: string = "";
    useEffect(() => {
      const cookies = new Cookies();
      session_payload = cookies.get("session_payload");
      setSession(decodeSessionToken(session_payload));
    }, [session_payload])

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
      const newSessionToken = encodeSessionToken(newSession);
      const cookies = new Cookies();
      cookies.set("session_payload", newSessionToken);
      setSession(newSession)
      return newSession.cache_key;
    }

    return { session, updateSession };
  } catch (e: any) {
    console.error(e);
    return { session: undefined, updateSession: (_: any) => {} }
  }
};

// const SessionContext = createContext<
//   | {
//       session: SessionData;
//       setSession: React.Dispatch<React.SetStateAction<SessionData>>;
//     }
//   | undefined
// >(undefined);

// const useSession = () => {
//   const context = useContext(SessionContext);
//   if (context === undefined) {
//     console.log("not used correctly");
//   }
//   return context;
// };

// const SessionProvider = (props: any) => {
//   const [session, setSession] = useState({
//     user_id: "",
//     email: "",
//     display_name: "",
//     image_url: "",
//   });
//   const value = { session, setSession };
//   return (
//     <SessionContext.Provider value={value}>
//       {props.children}
//     </SessionContext.Provider>
//   );
// };

export { useSession };
