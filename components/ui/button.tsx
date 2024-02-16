import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader } from "../loadar";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-sky-600 text-white hover:bg-sky-600/90",
        destructive: "bg-rose-700 text-white hover:bg-rose-700/90",
        outline:
          "border border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-black dark:text-white hover:text-accent-foreground",
        secondary:
          "bg-cyan-200 text-black dark:text-white hover:bg-cyan-200/80 dark:bg-cyan-700 dark:hover:bg-cyan-700/80",
        ghost: "bg-transparent hover:opacity-60",
        link: "text-sky-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        {...props}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={props.type || "button"}
      >
        {props.loading && <Loader />}
        {props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
