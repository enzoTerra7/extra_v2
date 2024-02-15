"use client";
import { ExtraProvider } from "@/context/hoursProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ExtraProvider>{children}</ExtraProvider>
    </>
  );
}
