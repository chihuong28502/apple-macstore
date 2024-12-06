import ReduxProvider from "@/core/components/ReduxProvider";
import LayoutHome from "@/layouts/LayoutHome";
import 'antd/dist/reset.css';
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import AuthProvider from "./AuthProvider";
import { RootStyleRegistry } from "./RootStyleRegistry";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
