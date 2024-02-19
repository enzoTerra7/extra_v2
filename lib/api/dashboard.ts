import { Extras } from "@prisma/client";
import {
  ConvertDateToDecimal,
  formatCurrency,
  minutesFormatter,
} from "../utils";
import {
  isWithinInterval,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";

export function CalculateTotalHoursExtra(extras: Extras[]): string {
  const totalHours = extras.reduce(
    (accumulator: number, currentExtra: Extras) => {
      return (
        accumulator +
        (ConvertDateToDecimal(currentExtra.hours_make) -
          ConvertDateToDecimal(currentExtra.discounted_hours))
      );
    },
    0,
  );

  return minutesFormatter(totalHours);
}

export function CalculateTotalExtraGains(extras: Extras[]): string {
  const totalGains = extras.reduce(
    (accumulator: number, currentExtra: Extras) => {
      return accumulator + currentExtra.gains;
    },
    0,
  );

  return formatCurrency(totalGains);
}

export function FilterExtrasByCurrentMonth(extras: Extras[]): Extras[] {
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  return extras.filter((extra) => {
    const objDate = parseISO(extra.date);
    return isWithinInterval(objDate, {
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });
  });
}

export function CalculateDecimalPastMonth(
  extras: Extras[],
): readonly [number, number] {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const filteredExtras = extras.filter((extra) => {
    const objDate = parseISO(extra.date);
    return isWithinInterval(objDate, {
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });
  });

  const pastMonthTotalGains = filteredExtras.reduce(
    (accumulator: number, currentExtra: Extras) => {
      return accumulator + currentExtra.gains;
    },
    0,
  );

  const pastMonthTotalHours = filteredExtras.reduce(
    (accumulator: number, currentExtra: Extras) => {
      return (
        accumulator +
        (ConvertDateToDecimal(currentExtra.hours_make) -
          ConvertDateToDecimal(currentExtra.discounted_hours))
      );
    },
    0,
  );

  return [pastMonthTotalHours, pastMonthTotalGains] as const;
}

export function FillMonthlyExtras(
  objects: Extras[],
): { date: string; hours: number }[] {
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const monthDates = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const filledMonthlyExtras = monthDates.map((date) => {
    const objForDate = objects.find(
      (obj) => obj.date === format(date, "yyyy-MM-dd"),
    );
    return {
      date: format(date, "dd/MM/yyyy"),
      hours: objForDate ? ConvertDateToDecimal(objForDate.hours_make) : 0,
    };
  });

  return filledMonthlyExtras;
}
