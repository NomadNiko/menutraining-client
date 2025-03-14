import ResponsiveAppBar from "@/components/app-bar/app-bar";
import AuthProvider from "@/services/auth/auth-provider";
import "../globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import '@fontsource-variable/orbitron';
import '@fontsource/new-tegomin';
import '@fontsource/iceland';
import CssBaseline from "@mui/material/CssBaseline";
import { NextUIProvider } from "@nextui-org/react";
import type { Metadata } from "next";
import { dir } from "i18next";
import "@/services/i18n/config";
import { languages } from "@/services/i18n/config";
import ToastContainer from "@/components/snackbar-provider";
import { getServerTranslation } from "@/services/i18n";
import StoreLanguageProvider from "@/services/i18n/store-language-provider";
import ThemeProvider from "@/components/theme/theme-provider";
import LeavePageProvider from "@/services/leave-page/leave-page-provider";
import QueryClientProvider from "@/services/react-query/query-client-provider";
import queryClient from "@/services/react-query/query-client";
import ReactQueryDevtools from "@/services/react-query/react-query-devtools";
import GoogleAuthProvider from "@/services/social-auth/google/google-auth-provider";
import FacebookAuthProvider from "@/services/social-auth/facebook/facebook-auth-provider";
import ConfirmDialogProvider from "@/components/confirm-dialog/confirm-dialog-provider";
import InitColorSchemeScript from "@/components/theme/init-color-scheme-script";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "common");
  return {
    title: t("title"),
    description: "Discover and book local activities, tours, lessons, rentals and tickets. iXplor connects you with nearby authentic local experiences and outdoor adventures.",
    keywords: "adventure booking, local tours, outdoor activities, travel experiences, adventure marketplace, outdoor lessons, equipment rentals, event tickets, guided tours, local experiences, outdoor adventures, adventure travel, local activities, adventure sports, outdoor recreation",
    metadataBase: new URL('https://ixplor.app/'),
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
  };
}

export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}) {
  const params = await props.params;
  const { language } = params;
  const { children } = props;

  return (
    <html lang={language} dir={dir(language)} suppressHydrationWarning>
      <head>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css' rel='stylesheet' />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <InitColorSchemeScript />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider>
            <CssBaseline />
            <NextUIProvider>
              <StoreLanguageProvider>
                <ConfirmDialogProvider>
                  <AuthProvider>
                    <GoogleAuthProvider>
                      <FacebookAuthProvider>
                        <LeavePageProvider>
                          <ResponsiveAppBar />
                          {children}
                          <ToastContainer
                            position="bottom-left"
                            hideProgressBar
                          />
                        </LeavePageProvider>
                      </FacebookAuthProvider>
                    </GoogleAuthProvider>
                  </AuthProvider>
                </ConfirmDialogProvider>
              </StoreLanguageProvider>
            </NextUIProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}