import LayoutHome from "@/layouts/LayoutHome";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { RootStyleRegistry } from "./RootStyleRegistry";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ReduxProvider from "@/core/components/ReduxProvider";
export async function Providers({ children }: { children: ReactNode }) {
  const message = await getMessages();
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RootStyleRegistry>
        <NextIntlClientProvider messages={message}>
          <LayoutHome>
            <ReduxProvider>{children}</ReduxProvider>
          </LayoutHome>
        </NextIntlClientProvider>
      </RootStyleRegistry>
    </ThemeProvider>
  );
}
