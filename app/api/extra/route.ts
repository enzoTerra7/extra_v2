import { prisma } from "@/prisma";
import { registeredExtraSchema } from "./dto";
import { GetBearerToken, ValidateSession } from "@/lib/api/auth";
import { CalculateExtraGains, hourDifference } from "@/lib/utils";
import { Extras } from "@prisma/client";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const parsedData = registeredExtraSchema.parse(data);

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

    const totalHoursMade = hourDifference(
      parsedData.initHours,
      parsedData.finalHours
    );

    const extra = await prisma.extras.create({
      data: {
        date: parsedData.date,
        description: parsedData.description,
        discounted_hours: parsedData.discountHours ? parsedData.discountedHours : undefined,
        hasDiscounted: parsedData.discountHours,
        start_hour: parsedData.initHours,
        end_hour: parsedData.finalHours,
        hours_make: totalHoursMade!,
        gains: CalculateExtraGains(
          user.extra_hour_value,
          totalHoursMade!,
          parsedData.discountedHours
        ),
        userId: user.id,
      },
    });

    prisma.$disconnect();

    return new Response(
      JSON.stringify({
        ...extra,
      }),
      {
        status: 201,
        statusText: "Created",
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

export type ExtraPayloadPostAndPut = {
  id: string;
  date: string;
  start_hour: string;
  end_hour: string;
  description: string;
  hasDiscounted: boolean;
  discounted_hours: string;
  hours_make: string;
  gains: number;
  userId: string;
};



export async function GET(request: Request) {
  try {
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

    const extras = await prisma.extras.findMany({
      where: {
        userId: user.id,
      },
    });

    prisma.$disconnect();

    return new Response(
      JSON.stringify({
        extras,
      }),
      {
        status: 200,
        statusText: "Returned extras",
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

export type ExtraPayloadGet = {
  extras: Extras[];
};
