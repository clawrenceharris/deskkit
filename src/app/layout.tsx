import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { prefetchAuthenticatedAppData } from "@/lib/queries/prefetchAuthenticatedAppData";
import "./globals.css";
import { AuthProvider, QueryProvider, ThemeProvider, UserProvider } from "./providers";
import { TooltipProvider, Toaster } from "@/components/ui";

export const metadata: Metadata = {
  title: "Deskitt",
  description: "Share and manage your study materials in one shared desk space.",
};
const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  try {
    await prefetchAuthenticatedAppData(queryClient);
  } catch (error) {
    console.error("[RootLayout] prefetchAuthenticatedAppData failed:", error);
  }
  const dehydratedState = dehydrate(queryClient);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`antialiased ${geistSans.variable} ${geistMono.variable} font-sans ${figtree.variable}`}
    >
     
      <body>
        <TooltipProvider> 
          <QueryProvider dehydratedState={dehydratedState}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange={false}
            >
              
                <AuthProvider>
                  <UserProvider>  
                    {children}
                  </UserProvider>
                </AuthProvider>
            
              <Toaster />

            </ThemeProvider>
          </QueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
