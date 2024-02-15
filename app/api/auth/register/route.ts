import { prisma } from "@/prisma";
import { registerUserSchema } from "./dto";
import bcrypt from "bcryptjs";
import { CalculateHoursValue } from "@/lib/utils";

export async function POST(request: Request) {
  const data = await request.json();
  try {
    const parsedData = registerUserSchema.parse(data);

    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

    const { hour_value, extra_hour_value } = CalculateHoursValue(
      parsedData.value,
      parseInt(parsedData.days),
      parseInt(parsedData.hours)
    );

    const user = await prisma.user.create({
      data: {
        email: parsedData.email,
        hashed_password: hashedPassword,
        name: parsedData.name,
        lastName: parsedData.lastName,
        phoneNumber: parsedData.phone,
        hours: parseInt(parsedData.hours),
        days: parseInt(parsedData.days),
        salary: parsedData.value,
        extra_hour_value,
        hour_value,
      },
    });
    prisma.$disconnect();
    return new Response(
      JSON.stringify({
        ...user,
        hashedPassword: undefined,
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
