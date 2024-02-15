"use client";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./authProvider";

const queryClient = new QueryClient();

interface ThemeProvider extends ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: ThemeProvider) {
  const { theme } = useTheme();

  return (
    <NextThemesProvider enableSystem {...props}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
      <Toaster
        richColors
        theme={theme as "light" | "dark"}
        closeButton
        toastOptions={{
          duration: 3000,
        }}
      />
    </NextThemesProvider>
  );
}
