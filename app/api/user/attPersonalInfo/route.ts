import {
  CreateSession,
  CreateSessionCookie,
  GetBearerToken,
  ValidateSession,
} from "@/lib/api/auth";
import { AttPersonalInfoSchema } from "./dto";
import { prisma } from "@/prisma";
import { Cookie, Session } from "lucia";
import { User } from "@prisma/client";

export async function PUT(request: Request) {
  const data = await request.json();
  try {
    const parsedData = AttPersonalInfoSchema.parse(data);

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

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: parsedData.email,
        name: parsedData.name,
        lastName: parsedData.lastName,
        phoneNumber: parsedData.phone,
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
        statusText: "User updated",
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

export type PersonalInfoUserPut = {
  user: User;
  session: Session;
  cookies: Cookie;
};
