"use client";
import React, { memo } from "react";
import { Icon, DatePicker, DatePickerProps } from "@tremor/react";
import { Controller, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { AlertCircle, Asterisk } from "lucide-react";

interface InputProps
  extends DatePickerProps,
    Partial<UseFormReturn<any, any, undefined>> {
  name?: string;
  label?: string;
  labelSuffix?: string;
  containerClass?: ClassNameValue;
  labelClass?: ClassNameValue;
  labelSuffixClass?: ClassNameValue;
  required?: boolean;
}

export const DateInput = memo(
  ({
    containerClass,
    label,
    labelSuffix,
    labelClass,
    labelSuffixClass,
    ...props
  }: InputProps) => (
    <div className={cn("flex flex-col gap-1.5", containerClass)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            "flex font-semibold text-sm items-center gap-1.5",
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
      {props.control ? (
        <>
          <Controller
            name={props.name!}
            control={props.control}
            disabled={props.disabled}
            defaultValue={props.defaultValue}
            render={({ field: { name, onChange, value, disabled } }) => (
              <DatePicker
                {...props}
                disabled={disabled}
                value={value}
                onChange={onChange}
                onValueChange={(e) => onChange(e)}
                aria-label={label}
                className="border rounded-lg border-neutral-600 px-2.5 space-x-2"
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
        <DatePicker {...props} aria-label={label} />
      )}
    </div>
  ),
  (prevProps, nextProps) =>
    prevProps.formState && nextProps.formState
      ? prevProps.formState.errors === nextProps.formState.errors
      : false,
);

DateInput.displayName = "DateInput";
