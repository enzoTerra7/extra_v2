"use client"
import React, { memo } from "react";
import {
  Icon,
  MultiSelect as TremorSelect,
  MultiSelectProps as TremorSelectProps,
} from "@tremor/react";
import { Controller, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { AlertCircle, Asterisk } from "lucide-react";

interface SelectProps
  extends TremorSelectProps,
    UseFormReturn<any, any, undefined> {
  name: string;
  required?: boolean;
  label?: string;
  labelSuffix?: string;
  containerClass?: ClassNameValue;
  labelClass?: ClassNameValue;
  labelSuffixClass?: ClassNameValue;
}

interface NoFormSelectProps extends TremorSelectProps {
  label?: string;
  required?: boolean;
  labelSuffix?: string;
  containerClass?: ClassNameValue;
  labelClass?: ClassNameValue;
  labelSuffixClass?: ClassNameValue;
}

export const MultiSelect = memo(
  ({
    register,
    formState: { errors },
    control,
    containerClass,
    label,
    labelSuffix,
    labelClass,
    labelSuffixClass,
    ...props
  }: SelectProps) => (
    <div className={cn("flex flex-col gap-1.5", containerClass)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            "flex font-semibold text-sm items-center gap-2.5",
            labelClass
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
              tooltip="Campo requirido!"
            />
          )}
        </label>
      )}
      <Controller
        name={props.name}
        defaultValue={props.defaultValue}
        control={control}
        disabled={props.disabled}
        render={({ field: { onChange, value, disabled } }) => (
          <TremorSelect
            {...props}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onValueChange={(e) => onChange(e)}
            aria-label={label}
          />
        )}
      />
      {errors[props.name]?.message && (
        <p className="text-red-500 dark:text-red-600 text-sm">
          <Icon icon={AlertCircle} size="sm" className="mr-1.5" />
          {errors[props.name]?.message as string}
        </p>
      )}
    </div>
  ),
  (prevProps, nextProps) =>
    prevProps.formState.errors === nextProps.formState.errors
);

export const NoFormMultiSelect = memo(
  ({
    containerClass,
    label,
    labelSuffix,
    labelClass,
    labelSuffixClass,
    ...props
  }: NoFormSelectProps) => (
    <div className={cn("flex flex-col gap-1.5", containerClass)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            "flex font-semibold text-sm items-center gap-2.5",
            labelClass
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
              tooltip="Campo requirido!"
            />
          )}
        </label>
      )}
      <TremorSelect {...props} aria-label={label} />
    </div>
  ),
  (prevProps, nextProps) => prevProps === nextProps
);

MultiSelect.displayName = "MultiSelect";
NoFormMultiSelect.displayName = "NoFormMultiSelect";
