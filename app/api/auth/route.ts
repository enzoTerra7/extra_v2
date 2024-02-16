import { prisma } from "@/prisma";
import { loginSchema } from "./dto";
import bcrypt from "bcryptjs";
import { Cookie, Session } from "lucia";
import { CreateSession, CreateSessionCookie } from "@/lib/api/auth";
import { User } from "@prisma/client";

/**
 * @swagger
 * /api/auth:
 *   post:
 *     description: Returns the user authorization with the current session and cookie
 *     responses:
 *       200:
 *         description: Successful login
 */

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const parsedData = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: {
        email: parsedData.email,
      },
    });

    prisma.$disconnect();

    if (!user) {
      return new Response(JSON.stringify("User not found"), {
        status: 404,
        statusText: "Don't find the user",
      });
    }

    const hashedPassword = bcrypt.compare(
      parsedData.password,
      user.hashed_password
    );

    if (!hashedPassword) {
      return new Response(JSON.stringify("Invalid Credentials"), {
        status: 400,
        statusText: "Wrong password or e-mail",
      });
    }

    const session: Session = await CreateSession(user);

    prisma.$disconnect();

    const sessionCookie = CreateSessionCookie(session.id, user);

    return new Response(
      JSON.stringify({
        session,
        user,
        sessionCookie,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
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

export type LoginResponse = {
  session: Session;
  user: User;
  cookie: {
    user: User;
    sessionCookie: Cookie;
  };
};
