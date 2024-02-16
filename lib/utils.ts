import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function minutesFormatter(minutes: number): string {
  const horas = Math.floor(minutes / 60);
  const minutosRestantes = minutes % 60;
  return `${horas}h${minutosRestantes}m`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function removeFormatCurrency(value: string): number {
  const valueWithoutDot = value.replaceAll(".", "");
  const valueWithoutPeriod = valueWithoutDot.replaceAll(",", ".");
  const valueUnFormatted = valueWithoutPeriod.replace(/[^\d.,]/g, "");
  return parseFloat(valueUnFormatted);
}

export type Mask =
  | "email"
  | "cpf"
  | "datetime"
  | "numeric"
  | "currency"
  | "decimal"
  | "integer"
  | (string & {})
  | (string[] & {})
  | null;

export function hourDifference(
  startHours?: string,
  endHours?: string,
): string | undefined {
  if (!startHours || !endHours) {
    return undefined;
  }

  let todayDate = format(new Date(), "MM-dd-yyyy");

  let startDate = new Date(`${todayDate} ${startHours}`);
  let endDate = new Date(`${todayDate} ${endHours}`);
  let timeDiff = Math.abs(startDate.getTime() - endDate.getTime());

  let hh: number | string = Math.floor(timeDiff / 1000 / 60 / 60);
  hh = ("0" + hh).slice(-2);

  timeDiff -= Number(hh) * 1000 * 60 * 60;
  let mm: number | string = Math.floor(timeDiff / 1000 / 60);
  mm = ("0" + mm).slice(-2);

  timeDiff -= Number(mm) * 1000 * 60;
  let ss: number | string = Math.floor(timeDiff / 1000);
  ss = ("0" + ss).slice(-2);

  return hh + ":" + mm;
}

export function CalculateHoursValue(
  salary: number,
  days: number,
  hours: number,
): {
  hour_value: number;
  extra_hour_value: number;
} {
  const hour_value = salary / 4.33 / (days * hours);
  const extra_hour_value = hour_value * 1.5;
  return { hour_value, extra_hour_value };
}

export function ConvertDateToDecimal(horas: string): number {
  const [stringHours, stringMinutes] = horas.split(":");
  const decimalHours = parseFloat(stringHours);
  const decimalMinutes = parseFloat(stringMinutes) / 60;
  return decimalHours + decimalMinutes;
}

export function CalculateExtraGains(
  extraHoursValue: number,
  totalHoursMade: string,
  discountedHours?: string,
): number {
  const extraHoursRealized = ConvertDateToDecimal(totalHoursMade);
  if (discountedHours) {
    const discountedHoursDecimal = ConvertDateToDecimal(discountedHours);

    const totalExtraHoursGains =
      extraHoursValue * (extraHoursRealized - discountedHoursDecimal);

    return totalExtraHoursGains;
  }

  const totalExtraHoursGains = extraHoursValue * extraHoursRealized;

  return totalExtraHoursGains;
}
