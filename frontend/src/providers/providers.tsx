import LayoutHome from "@/layouts/LayoutHome";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { RootStyleRegistry } from "./RootStyleRegistry";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ReduxProvider from "@/core/components/ReduxProvider";
import AuthProvider from "./AuthProvider";
export async function Providers({ children }: { children: ReactNode }) {
  const message = await getMessages();
  return (
    <ReduxProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <RootStyleRegistry>
          <NextIntlClientProvider messages={message}>
            <AuthProvider>
              <LayoutHome>{children}</LayoutHome>
            </AuthProvider>
          </NextIntlClientProvider>
        </RootStyleRegistry>
      </ThemeProvider>
    </ReduxProvider>
  );
}
