import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-40 hidden border-b border-white/10 bg-black/80 backdrop-blur-xl md:block">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/dashboard" className="text-xl font-bold text-white">
            Tattoo<span className="text-purple-500">AI</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/studio"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Studio
            </Link>
            <Link
              href="/generate"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Generate
            </Link>
            <Link
              href="/gallery"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Gallery
            </Link>
            <Link
              href="/saved"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Saved
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content */}
      <main className="pb-20 pt-14 md:pb-0 md:pt-0">{children}</main>
    </div>
  );
}
