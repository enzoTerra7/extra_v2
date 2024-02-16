import { GetBearerToken, ValidateSession } from "@/lib/api/auth";
import { registeredExtraSchema } from "../dto";
import { CalculateExtraGains, hourDifference } from "@/lib/utils";
import { prisma } from "@/prisma";

type ContextRoute = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, context: ContextRoute) {
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
      parsedData.finalHours,
    );

    const extra = await prisma.extras.update({
      where: {
        id: context.params.id,
      },
      data: {
        date: parsedData.date,
        description: parsedData.description,
        discounted_hours: parsedData.discountHours
          ? parsedData.discountedHours
          : "00:00",
        hasDiscounted: parsedData.discountHours,
        start_hour: parsedData.initHours,
        end_hour: parsedData.finalHours,
        hours_make: totalHoursMade!,
        gains: CalculateExtraGains(
          user.extra_hour_value,
          totalHoursMade!,
          parsedData.discountedHours,
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
        status: 200,
        statusText: "Edited",
      },
    );
  } catch (e) {
    prisma.$disconnect();
    return new Response(JSON.stringify(e), {
      status: 400,
      statusText: "Bad Request - Wrong payload",
    });
  }
}

export async function DELETE(request: Request, context: ContextRoute) {
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

    const extra = await prisma.extras.delete({
      where: {
        id: context.params.id,
      },
    });

    prisma.$disconnect();

    return new Response(
      JSON.stringify({
        ...extra,
      }),
      {
        status: 200,
        statusText: "Deleted extra",
      },
    );
  } catch (e) {
    prisma.$disconnect();
    return new Response(JSON.stringify(e), {
      status: 400,
      statusText: "Bad Request - Wrong payload",
    });
  }
}

// export async function GET(request: Request, context: ContextRoute) {
//   try {
//     const authorizationHeader = request.headers.get("Authorization");

//     const sessionId = await GetBearerToken(authorizationHeader);

//     if (typeof sessionId !== "string") {
//       return new Response(JSON.stringify("Unauthorized"), {
//         status: 401,
//         statusText: "Unauthorized",
//       });
//     }

//     const { user } = await ValidateSession(sessionId);

//     if (!user) {
//       return new Response(JSON.stringify("Unauthorized"), {
//         status: 401,
//         statusText: "Unauthorized",
//       });
//     }

//     const extra = await prisma.extras.findUnique({
//       where: {
//         id: context.params.id,
//       },
//     });

//     prisma.$disconnect();

//     return new Response(
//       JSON.stringify({
//         ...extra,
//       }),
//       {
//         status: 200,
//         statusText: "Founded extra",
//       }
//     );
//   } catch (e) {
//     prisma.$disconnect();
//     return new Response(JSON.stringify(e), {
//       status: 400,
//       statusText: "Bad Request - Wrong payload",
//     });
//   }
// }
