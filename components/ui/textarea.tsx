"use client";
import React, { memo } from "react";
import {
  Icon,
  Textarea as TremorTextArea,
  TextareaProps as TremorTextareaProps,
} from "@tremor/react";
import { Controller, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { AlertCircle, Asterisk } from "lucide-react";

interface TextareaProps
  extends TremorTextareaProps,
    Partial<UseFormReturn<any, any, undefined>> {
  name: string;
  label?: string;
  labelSuffix?: string;
  containerClass?: ClassNameValue;
  labelClass?: ClassNameValue;
  labelSuffixClass?: ClassNameValue;
}

export const Textarea = memo(
  ({
    register,
    control,
    containerClass,
    label,
    labelSuffix,
    labelClass,
    labelSuffixClass,
    ...props
  }: TextareaProps) => (
    <div className={cn("flex flex-col gap-1.5", containerClass)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            "flex font-semibold text-sm items-center gap-2.5",
            labelClass,
          )}
        >
          {label}
          {labelSuffix && (
            <span className={cn("text-xs text-gray-500", labelSuffixClass)}>
              {labelSuffix}
            </span>
          )}
          {props.required && (
            <Icon
              icon={Asterisk}
              size="xs"
              className="text-red-500 dark:text-red-600"
            />
          )}
        </label>
      )}
      {control ? (
        <>
          <Controller
            name={props.name!}
            control={control}
            disabled={props.disabled}
            defaultValue={props.defaultValue}
            render={({ field: { name, onChange, value, disabled } }) => (
              <TremorTextArea
                {...props}
                name={name}
                disabled={disabled}
                value={value}
                onValueChange={(e) => onChange(e)}
                aria-label={label}
                className={cn(
                  "bg-transparent disabled:bg-neutral-300/80 hover:disabled:bg-neutral-300/80 disabled:border-neutral-300/80 dark:disabled:bg-neutral-600/80 dark:hover:disabled:bg-neutral-600/80 dark:disabled:border-neutral-600/80",
                  props.className,
                )}
              />
            )}
          />

          {props.formState!.errors[props.name!]?.message && (
            <p className="text-red-500 dark:text-red-600 text-sm items-center flex gap-2.5">
              <Icon icon={AlertCircle} size="sm" />
              {props.formState!.errors[props.name!]?.message as string}
            </p>
          )}
        </>
      ) : (
        <>
          <TremorTextArea
            {...props}
            aria-label={label}
            className={cn("bg-transparent", props.className)}
          />
        </>
      )}
    </div>
  ),
  (prevProps, nextProps) => prevProps === nextProps,
);

Textarea.displayName = "Textarea";
