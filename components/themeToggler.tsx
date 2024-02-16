"use client";

import { MoonStarIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <SunIcon className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonStarIcon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
    </div>
  );
}
