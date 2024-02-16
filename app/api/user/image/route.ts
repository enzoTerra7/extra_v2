import {
  CreateSession,
  CreateSessionCookie,
  GetBearerToken,
  ValidateSession,
} from "@/lib/api/auth";
import { AttUserPhotoSchema } from "./dto";
import { prisma } from "@/prisma";
import { Cookie, Session } from "lucia";
import { User } from "@prisma/client";
import { CalculateHoursValue } from "@/lib/utils";
import { uploadImage } from "@/lib/api/fileUpload";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const parsedData = AttUserPhotoSchema.parse(data);

    const authorizationHeader = request.headers.get("Authorization");

    const sessionId = await GetBearerToken(authorizationHeader);

    if (typeof sessionId !== "string") {
      return new Response(JSON.stringify("Unauthorized"), {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const { user } = await ValidateSession(sessionId);

    if (!user) {
      return new Response(JSON.stringify("Unauthorized"), {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const image = await uploadImage(parsedData.file, `user-${user.id}-photo`);

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        image,
      },
    });

    prisma.$disconnect();

    const session: Session = await CreateSession(updatedUser);

    prisma.$disconnect();

    const { sessionCookie } = CreateSessionCookie(session.id, updatedUser);

    return new Response(
      JSON.stringify({
        user: updatedUser,
        session: session,
        cookie: sessionCookie,
      }),
      {
        status: 201,
        statusText: "User salary infos updated",
      }
    );
  } catch (e) {
    prisma.$disconnect();
    return new Response(JSON.stringify(e), {
      status: 400,
      statusText: "Bad Request - Wrong payload",
    });
  }
}

export type UpdateUserPhoto = {
  user: User;
  session: Session;
  cookies: Cookie;
};
