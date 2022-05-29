import Cookies from "universal-cookie";
import { decodeSessionToken } from "lib/session";
import { SessionData } from "lib/types";

const useSession = () => {
  try {
    const cookies = new Cookies();
    const session_payload = cookies.get("session_payload");
    return decodeSessionToken(session_payload) as SessionData;
  } catch (e: any) {
    console.error(e);
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
