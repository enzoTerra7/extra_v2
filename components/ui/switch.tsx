"use client";
import React, { memo } from "react";
import { Icon } from "@tremor/react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { Controller, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { AlertCircle, Asterisk } from "lucide-react";

interface SwitchProps
  extends RadixSwitch.SwitchProps,
    Partial<UseFormReturn<any, any, undefined>> {
  name: string;
  label?: string;
  labelSuffix?: string;
  containerClass?: ClassNameValue;
  labelClass?: ClassNameValue;
  labelSuffixClass?: ClassNameValue;
  text?: React.ReactNode;
}

export const Switch = memo(
  ({
    register,
    control,
    containerClass,
    label,
    labelSuffix,
    labelClass,
    labelSuffixClass,
    text,
    ...props
  }: SwitchProps) => (
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
      {control ? (
        <>
          <div className="flex items-center gap-2.5">
            <Controller
              name={props.name}
              control={control}
              disabled={props.disabled}
              defaultValue={props.defaultValue}
              render={({ field: { name, onChange, value, disabled } }) => (
                // <RadixSwitch
                //   {...props}
                //   name={name}
                //   disabled={disabled}
                //   checked={value}
                //   onChange={onChange}
                //   aria-label={label}
                // />
                <RadixSwitch.Root
                  {...props}
                  className={cn(
                    "w-10 h-4 flex items-center rounded-full relative bg-neutral-500 data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-600 outline-none cursor-pointer disabled:pointer-events-none",
                    props.className
                  )}
                  name={name}
                  disabled={disabled}
                  checked={value}
                  onCheckedChange={(e) => {
                    onChange(e);
                    if (props.onCheckedChange) props.onCheckedChange(e);
                  }}
                  aria-label={label}
                >
                  <RadixSwitch.Thumb className="block absolute w-6 h-6 right-[50%] dark:border shadow dark:border-neutral-800 data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-400  bg-white dark:bg-neutral-700 rounded-full transition-all duration-200 data-[state=checked]:right-0" />
                </RadixSwitch.Root>
              )}
            />
            {text && (
              <label
                htmlFor={props.id}
                className={cn(
                  "flex font-normal cursor-pointer text-sm items-center gap-2.5",
                  {
                    "cursor-default": props.disabled,
                  }
                )}
              >
                {text}
              </label>
            )}
          </div>

          {props.formState!.errors[props.name!]?.message && (
            <p className="text-red-500 dark:text-red-600 text-sm items-center flex gap-2.5">
              <Icon icon={AlertCircle} size="sm" />
              {props.formState!.errors[props.name!]?.message as string}
            </p>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2.5">
          <RadixSwitch.Root {...props}>
            <RadixSwitch.Thumb />
          </RadixSwitch.Root>
          {text && (
            <label
              htmlFor={props.id}
              className={cn(
                "flex font-normal cursor-pointer text-sm items-center gap-2.5",
                {
                  "cursor-default": props.disabled,
                }
              )}
            >
              {text}
            </label>
          )}
        </div>
      )}
    </div>
  ),
  (prevProps, nextProps) => prevProps === nextProps
);

Switch.displayName = "Switch";
