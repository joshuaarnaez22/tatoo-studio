import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-white">
        Welcome back, {user?.firstName || "Artist"}
      </h1>
      <p className="mb-12 text-gray-400">
        Ready to create your next masterpiece?
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/studio"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-purple-500/50 hover:bg-white/10"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-2xl">
            🎨
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            Tattoo Studio
          </h2>
          <p className="text-sm text-gray-400">
            Upload your photo and preview tattoo designs on your body
          </p>
        </Link>

        <Link
          href="/generate"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-500/50 hover:bg-white/10"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-2xl">
            ✨
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            AI Generate
          </h2>
          <p className="text-sm text-gray-400">
            Create unique tattoo designs with AI from text prompts
          </p>
        </Link>

        <Link
          href="/gallery"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-pink-500/50 hover:bg-white/10"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20 text-2xl">
            🖼️
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            Design Gallery
          </h2>
          <p className="text-sm text-gray-400">
            Browse curated tattoo designs and find inspiration
          </p>
        </Link>

        <Link
          href="/saved"
          className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-500/50 hover:bg-white/10"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-2xl">
            💾
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            Saved Designs
          </h2>
          <p className="text-sm text-gray-400">
            View your saved designs and generation history
          </p>
        </Link>
      </div>
    </div>
  );
}
