// import { Extras } from "@prisma/client";
import api from "../axios";
import Cookies from "js-cookie";
import { User } from "@prisma/client";
import { Session } from "lucia";

// export async function GetExtrasById(extraId: string): Promise<Extras | null> {
//   try {
//     const { data } = await api.get(`/extra/${extraId}`);
//     return data;
//   } catch (e) {
//     return null;
//   }
// }

export function UpdateCookiesAndHeader(user: User, session: Session) {
  Cookies.set(
    "user",
    JSON.stringify({
      ...user,
      sessionId: session.id,
    }),
    {
      expires: 14,
    }
  );
  api.defaults.headers.common.Authorization = `Bearer ${session.id}`;
}
