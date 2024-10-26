import LayoutHome from "@/layouts/LayoutHome";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { RootStyleRegistry } from "./RootStyleRegistry";
import ReduxProvider from "@/core/components/ReduxProvider";
import AuthProvider from "./AuthProvider";
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
