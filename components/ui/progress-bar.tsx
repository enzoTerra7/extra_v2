"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { ClassNameValue } from "tailwind-merge";

interface ProgressBar {
  containerClass?: ClassNameValue;
  progressClass?: ClassNameValue;
  progress: number;
}

export function ProgressBar(props: ProgressBar) {
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (progressRef.current) {
      const width = props.progress > 100 ? 100 : props.progress;

      progressRef.current.style.width = `${width}%`;
    }
  }, [props.progress]);

  return (
    <div
      className={cn(
        "relative w-full rounded-full h-2 bg-neutral-200 dark:bg-neutral-800",
        props.containerClass,
      )}
    >
      <div
        ref={progressRef}
        className={cn(
          "absolute transition-all duration-200 h-2 rounded-full bg-sky-600",
          props.progressClass,
        )}
      />
    </div>
  );
}
