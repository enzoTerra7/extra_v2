import {
  CreateSession,
  CreateSessionCookie,
  GetBearerToken,
  ValidateSession,
} from "@/lib/api/auth";
import { AttSalaryInfoSchema } from "./dto";
import { prisma } from "@/prisma";
import { Cookie, Session } from "lucia";
import { User } from "@prisma/client";
import { CalculateHoursValue } from "@/lib/utils";

export async function PUT(request: Request) {
  const data = await request.json();
  try {
    const parsedData = AttSalaryInfoSchema.parse(data);

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

    const { hour_value, extra_hour_value } = CalculateHoursValue(
      parsedData.value,
      parseInt(parsedData.days),
      parseInt(parsedData.hours)
    );

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        salary: parsedData.value,
        days: parseInt(parsedData.days),
        hours: parseInt(parsedData.hours),
        hour_value,
        extra_hour_value,
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

export type PersonalSalaryUserPut = {
  user: User;
  session: Session;
  cookies: Cookie;
};
