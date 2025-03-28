import type { Metadata } from "next";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "@mantine/core/styles.css";
import { Header } from "@/screens/LandingScreen/header/header";

export const metadata: Metadata = {
  title: "Event Sync",
  description: "An event management web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" {...mantineHtmlProps}>
        <head>
          <ColorSchemeScript defaultColorScheme="dark" />
          <style>{`
            :root {
              color-scheme: dark;
            }
            body {
              background-color: #1a1b1e;
              color: #C1C2C5;
            }
          `}</style>
        </head>
        <body>
          <Providers>
            <MantineProvider defaultColorScheme="dark">
              <Header />
              {children}
            </MantineProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
