"use client";
import { Aside } from "@/components/aside";
import { Header } from "@/components/header";
import { Loader } from "@/components/loadar";
import { useAuth } from "@/context/authProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  if (status !== "logged") {
    return (
      <div className="min-h-[100svh] min-w-screen flex">
        <Aside />
        <div className="bg-background w-full xl:ml-64 flex h-[100svh] items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] min-w-screen flex">
      <Aside />
      <div className="bg-background w-full xl:ml-64 flex flex-col">
        <Header />
        <main className="w-full flex flex-col gap-6 p-4 xl:px-8 xl:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
