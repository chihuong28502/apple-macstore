import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import ReduxProvider from "@/core/components/ReduxProvider";
import LayoutHome from "@/layouts/LayoutHome";
import AuthProvider from "./AuthProvider";
import { RootStyleRegistry } from "./RootStyleRegistry";

export async function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <RootStyleRegistry>
            <AuthProvider>
              <LayoutHome>{children}</LayoutHome>
            </AuthProvider>
        </RootStyleRegistry>
      </ThemeProvider>
    </ReduxProvider>
  );
}
