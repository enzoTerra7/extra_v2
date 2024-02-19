import { prisma } from "@/prisma";
import { GetBearerToken, ValidateSession } from "@/lib/api/auth";
import {
  CalculateTotalExtraGains,
  CalculateTotalHoursExtra,
  FillMonthlyExtras,
  FilterExtrasByCurrentMonth,
  CalculateDecimalPastMonth,
} from "@/lib/api/dashboard";
import { ConvertDateToDecimal, minutesFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { Extras } from "@prisma/client";

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

    const filteredMonthExtras = FilterExtrasByCurrentMonth(extras);
    const monthlyHours = CalculateTotalHoursExtra(filteredMonthExtras);
    const monthlyGains = CalculateTotalExtraGains(filteredMonthExtras);

    const decimalTotalHours: number = extras.reduce(
      (accumulator: number, currentExtra: Extras) => {
        return (
          accumulator +
          (ConvertDateToDecimal(currentExtra.hours_make) -
            ConvertDateToDecimal(currentExtra.discounted_hours))
        );
      },
      0,
    );
    const decimalMonthlyHours: number = filteredMonthExtras.reduce(
      (accumulator: number, currentExtra: Extras) => {
        return (
          accumulator +
          (ConvertDateToDecimal(currentExtra.hours_make) -
            ConvertDateToDecimal(currentExtra.discounted_hours))
        );
      },
      0,
    );
    const decimalMonthlyGains: number = filteredMonthExtras.reduce(
      (accumulator: number, currentExtra: Extras) => {
        return accumulator + currentExtra.gains;
      },
      0,
    );
    const decimalTotalGains: number = extras.reduce(
      (accumulator: number, currentExtra: Extras) => {
        return accumulator + currentExtra.gains;
      },
      0,
    );

    const formattedTotalHours = minutesFormatter(decimalTotalHours);

    const [pastMonthDecimalHours, pastMonthDecimalGains] =
      CalculateDecimalPastMonth(extras);

    const payload: DashboardPayloadGet = {
      monthlyHours,
      monthlyGains,
      graphData: FillMonthlyExtras(filteredMonthExtras),
      cardsData: [
        {
          title: "Horas Feitas no Mês",
          metric: monthlyHours,
          delta:
            pastMonthDecimalHours === 0
              ? "100%"
              : ((decimalMonthlyHours * 100) / pastMonthDecimalHours)
                  .toFixed(2)
                  .replace(".", ",") + "%",
          deltaType:
            decimalMonthlyHours > pastMonthDecimalHours
              ? "increase"
              : decimalMonthlyHours < pastMonthDecimalHours
                ? "decrease"
                : "unchanged",
          progress: decimalMonthlyHours,
          total: decimalTotalHours,
        },
        {
          title: "Horas Totais",
          metric: formattedTotalHours,
          delta: "0%",
          deltaType: "unchanged",
          progress: decimalTotalHours,
          total: decimalTotalHours,
        },
        {
          title: "Lucro no Mês",
          metric: monthlyGains,
          delta:
            pastMonthDecimalHours === 0
              ? "100%"
              : ((decimalMonthlyGains * 100) / pastMonthDecimalGains)
                  .toFixed(2)
                  .replace(".", ",") + "%",
          deltaType:
            decimalMonthlyGains > pastMonthDecimalGains
              ? "increase"
              : decimalMonthlyGains < pastMonthDecimalGains
                ? "decrease"
                : "unchanged",
          progress: decimalMonthlyGains,
          total: decimalTotalGains,
        },
      ],
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      statusText: "Returned extras",
    });
  } catch (e) {
    prisma.$disconnect();
    return new Response(JSON.stringify(e), {
      status: 400,
      statusText: "Bad Request - Wrong payload",
    });
  }
}

type deltaType = "increase" | "unchanged" | "decrease";

export type DashboardPayloadGet = {
  monthlyHours: string;
  monthlyGains: string;
  graphData: {
    date: string;
    hours: number;
  }[];
  cardsData: [
    {
      title: "Horas Feitas no Mês";
      metric: string;
      deltaType: deltaType;
      delta: string;
      total: number;
      progress: number;
    },
    {
      title: "Horas Totais";
      metric: string;
      deltaType: deltaType;
      delta: string;
      total: number;
      progress: number;
    },
    {
      title: "Lucro no Mês";
      metric: string;
      deltaType: deltaType;
      delta: string;
      total: number;
      progress: number;
    },
  ];
};
