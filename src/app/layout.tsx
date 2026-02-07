import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tattoo AI Studio",
  description:
    "Visualize and generate custom tattoo designs with AI. Upload your photo, preview designs, and bring your tattoo ideas to life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#f59e0b",
          colorBackground: "#0f0f0f",
          colorText: "#ffffff",
          colorTextSecondary: "#a1a1aa",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#ffffff",
          colorNeutral: "#ffffff",
        },
        elements: {
          // General
          rootBox: "w-full",
          card: "bg-[#0f0f0f] border border-white/10 shadow-2xl",
          // Header
          headerTitle: "text-white",
          headerSubtitle: "text-zinc-400",
          // Social buttons
          socialButtonsBlockButton:
            "bg-white/5 border border-white/10 text-white hover:bg-white/10",
          socialButtonsBlockButtonText: "text-white",
          // Divider
          dividerLine: "bg-white/10",
          dividerText: "text-zinc-500",
          // Form
          formFieldLabel: "text-zinc-300",
          formFieldInput:
            "bg-white/5 border-white/10 text-white placeholder:text-zinc-500",
          formButtonPrimary:
            "bg-amber-600 hover:bg-amber-700 text-white font-medium",
          formFieldAction: "text-amber-500 hover:text-amber-400",
          // Footer
          footerActionLink: "text-amber-500 hover:text-amber-400",
          footerActionText: "text-zinc-400",
          // User button dropdown
          userButtonPopoverCard: "bg-[#0f0f0f] border border-white/10",
          userButtonPopoverActionButton:
            "text-white hover:bg-white/10",
          userButtonPopoverActionButtonText: "text-white",
          userButtonPopoverActionButtonIcon: "text-zinc-400",
          userButtonPopoverFooter: "hidden",
          userPreviewMainIdentifier: "text-white",
          userPreviewSecondaryIdentifier: "text-zinc-400",
          // Internal elements
          identityPreviewText: "text-white",
          identityPreviewEditButton: "text-amber-500",
          formResendCodeLink: "text-amber-500",
          otpCodeFieldInput: "bg-white/5 border-white/10 text-white",
          alertText: "text-zinc-300",
          // Badge
          badge: "bg-amber-600/20 text-amber-500",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.variable} bg-black font-sans antialiased`}>
          <Providers>{children}</Providers>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
