"use client";
import React, { InputHTMLAttributes } from "react";
import { Icon } from "@tremor/react";
import { UseFormReturn } from "react-hook-form";
import { Mask, cn } from "@/lib/utils";
import { ClassNameValue } from "tailwind-merge";
import { AlertCircle, Asterisk, Eye, EyeOff } from "lucide-react";
import { useHookFormMask, withMask } from "use-mask-input";
import { NumericFormat } from "react-number-format";

interface NumericFormatProps {
  onValueChange: (e: number | undefined) => void;
  decimalScale?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
  prefix?: string;
  suffix?: string;
}

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    Partial<UseFormReturn<any, any, undefined>>,
    Partial<NumericFormatProps> {
  name?: string;
  label?: string;
  labelSuffix?: string;
  containerClass?: ClassNameValue;
  labelClass?: ClassNameValue;
  labelSuffixClass?: ClassNameValue;
  mask?: Mask;
  icon?: React.ElementType<any, keyof React.JSX.IntrinsicElements>;
  rightIcon?: React.ElementType<any, keyof React.JSX.IntrinsicElements>;
}

export const InputContainer = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) => (
  <label
    htmlFor={id}
    className="tremor-TextInput-root relative w-full flex items-center min-w-[10rem] outline-none rounded-tremor-default transition duration-100 shadow-tremor-input dark:shadow-dark-tremor-input bg-transparent dark:bg-transparent hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted text-tremor-content dark:text-dark-tremor-content dark:border-dark-tremor-border border border-neutral-600 px-2.5 space-x-2 focus-within:ring-1 focus-within:ring-sky-600 h-10 [&:has(input:disabled)]:bg-neutral-300/80 hover:[&:has(input:disabled)]:bg-neutral-300/80 [&:has(input:disabled)]:border-neutral-300/80 dark:[&:has(input:disabled)]:bg-neutral-600/80 dark:hover:[&:has(input:disabled)]:bg-neutral-600/80 dark:[&:has(input:disabled)]:border-neutral-600/80"
  >
    {children}
  </label>
);

export const Input = ({
  containerClass,
  label,
  labelSuffix,
  labelClass,
  labelSuffixClass,
  mask,
  ...props
}: InputProps) => {
  const Comp = props.onValueChange ? NumericFormat : "input";
  const [showPassword, setShowPassword] = React.useState(false);
  let inputProps: {
    register: any;
  } = {
    register: props.register,
  };
  if (props.register) {
    if (mask) {
      // eslint-disable-next-line
      const register = useHookFormMask(props.register);
      inputProps = {
        register: register(props.name!, mask, {
          onChange: props.onChange,
          showMaskOnHover: false,
          showMaskOnFocus: false,
        }),
      };
    } else {
      inputProps = {
        register: props.register(props.name!, {
          onChange: props.onChange,
        }),
      };
    }
  }
  return (
    <div className={cn("flex flex-col gap-1.5", containerClass)}>
      {label && (
        <label
          htmlFor={props.id}
          className={cn(
            "flex font-semibold text-sm items-center gap-1.5 h-6",
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
            />
          )}
        </label>
      )}
      <InputContainer id={props.id}>
        {props.control ? (
          <>
            {props.icon && (
              <Icon className="px-1" icon={props.icon} size="md" />
            )}
            <Comp
              {...props}
              {...inputProps.register}
              type={
                props.type == "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : props.type
              }
              className={cn(
                "bg-transparent dark:text-white text-dark outline-none border-none flex-1 placeholder:text-neutral-500 text-sm h-full w-full autofill:bg-black!"
              )}
              onValueChange={(e) => {
                if (props.onValueChange) {
                  props.onValueChange(e.floatValue);
                }
              }}
            />
            {props.type === "password" ? (
              <Icon
                icon={!showPassword ? Eye : EyeOff}
                size="md"
                onClick={() => setShowPassword(!showPassword)}
                className="px-1 cursor-pointer"
              />
            ) : (
              (props.rightIcon && (
                <Icon className="px-1" icon={props.rightIcon} size="md" />
              )) ||
              null
            )}
          </>
        ) : (
          <>
            {props.icon && (
              <Icon className="px-1" icon={props.icon} size="md" />
            )}
            <Comp
              {...props}
              ref={mask ? withMask(mask) : undefined}
              className={cn(
                "bg-transparent dark:text-white text-dark outline-none border-none flex-1 placeholder:text-neutral-500 text-sm h-full"
              )}
              //@ts-expect-error I know the type will be right when i used
              type={
                props.type == "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : props.type
              }
            />
            {props.type === "password" ? (
              <Icon
                icon={!showPassword ? Eye : EyeOff}
                size="md"
                onClick={() => setShowPassword(!showPassword)}
                className="px-1 cursor-pointer"
              />
            ) : (
              (props.rightIcon && (
                <Icon className="px-1" icon={props.rightIcon} size="md" />
              )) ||
              null
            )}
          </>
        )}
      </InputContainer>
      {props.formState && props.formState!.errors[props.name!]?.message && (
        <p className="text-red-500 dark:text-red-600 text-sm items-center flex gap-2.5">
          <Icon icon={AlertCircle} size="sm" />
          {props.formState!.errors[props.name!]?.message as string}
        </p>
      )}
    </div>
  );
};

InputContainer.displayName = "InputContainer";
Input.displayName = "Input";
