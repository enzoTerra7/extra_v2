"use client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { UseFormHandleSubmit, useForm } from "react-hook-form";
import { ClassNameValue } from "tailwind-merge";

interface FormProps {
  children: React.ReactElement[];
  onSubmit: (e?: any) => any;
  className?: ClassNameValue;
  handleSubmit: UseFormHandleSubmit<any, undefined>
}

export default function Form({
  children,
  onSubmit,
  className,
  handleSubmit
}: FormProps) {

  return (
    <form
      className={cn("flex flex-col gap-3.5 w-full", className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      {children}
    </form>
  );
}
