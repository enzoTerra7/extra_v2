import { Session, User } from "@prisma/client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import {
  GetUserSessions,
  InvalidateUserSection,
  RemoveUnusedSessions,
} from "./functions/authProviderFunctions";
import api from "@/lib/axios";

type Authenticated = {
  user: Omit<User, "hashed_password"> | null;
  session: Session | null;
};

type AuthenticationStatus = "loading" | "logged" | "unauthorized";

type Authentication = {
  data: Authenticated | null;
  setData: Dispatch<SetStateAction<Authenticated | null>>;
  status: AuthenticationStatus;
  getUser: () => Promise<null | Authenticated>;
  userSignOut: () => void;
};

const AuthContext = createContext<Authentication>({
  data: null,
  status: "loading",
  async getUser() {
    return null;
  },
  userSignOut() {},
  setData: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<Authenticated | null>(null);
  const [status, setStatus] = useState<AuthenticationStatus>("loading");

  const getUser = useCallback(async () => {
    if (status !== "logged") {
      setStatus((e) => "loading");
    }
    const user = Cookies.get("user");
    if (user) {
      const parsedData = JSON.parse(user);
      api.defaults.headers.common.Authorization = `Bearer ${parsedData.sessionId}`;
      const allUserSessions = await GetUserSessions(parsedData.id);
      if (!!allUserSessions.length && parsedData) {
        const currentSession = allUserSessions.find(
          (e) => e.id == parsedData.sessionId,
        );
        if (currentSession) {
          const currentDateTime = new Date();
          const sessionDateTime = new Date(currentSession.expiresAt);
          if (currentDateTime < sessionDateTime) {
            setData({
              session: parsedData.currentSession,
              user: parsedData,
            });
            setStatus((e) => "logged");
            if (pathname == "/") {
              router.push("/dashboard");
            }
            return parsedData;
          }
        }
      }
    }
    if (pathname != "/" && pathname != "/create-account") {
      router.push("/");
    }
    Cookies.remove("user");
    RemoveUnusedSessions();
    setStatus((e) => "unauthorized");
    return null;
  }, [pathname, router, status]);

  const userSignOut = useCallback(() => {
    const user = Cookies.get("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      InvalidateUserSection(parsedUser.id);
      RemoveUnusedSessions();
    }
    Cookies.remove("user");
    router.push("/");
    setStatus((e) => "unauthorized");
  }, [router]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <AuthContext.Provider
      value={{
        data: status === "loading" || status === "unauthorized" ? null : data,
        setData,
        status: status,
        getUser,
        userSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
