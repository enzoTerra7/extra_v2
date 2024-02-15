import { PrismaClient, Session, User } from "@prisma/client";
import { Lucia, TimeSpan } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

export const prisma = new PrismaClient();

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(2, "w"), // 2 weeks
  getUserAttributes: (attributes) => {
    return {
      // we don't need to expose the hashed password!
      id: attributes.id,
      name: attributes.name,
      lastName: attributes.lastName,
      email: attributes.email,
      phoneNumber: attributes.phoneNumber,
      salary: attributes.salary,
      days: attributes.days,
      hours: attributes.hours,
      hour_value: attributes.hour_value,
      extra_hour_value: attributes.extra_hour_value,
    };
  },
  getSessionAttributes: (attributes) => {
    return attributes;
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
    DatabaseSessionAttributes: Session;
  }
}
