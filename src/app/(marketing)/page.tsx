"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";

// Dynamically import 3D scene to avoid SSR issues
const HeroScene = dynamic(
  () => import("@/components/3d/HeroScene").then((mod) => mod.HeroScene),
  { ssr: false }
);

// Tattoo-inspired color palette
// Primary: Deep blacks, charcoal grays
// Accents: Gold/amber (traditional), crimson red (blood/ink), teal (modern tattoo)

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCard({
  children,
  className = "",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scaleIn}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const featuresRef = useRef(null);
  const stylesRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const stylesInView = useInView(stylesRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle texture overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

      {/* Navigation - Fixed at top */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-amber-900/10 bg-[#0a0a0a]/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-white">Tattoo</span>
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">AI</span>
          </motion.div>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/sign-in"
                className="text-sm text-gray-400 transition hover:text-amber-400"
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/sign-up"
                className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-700 px-5 py-2.5 text-sm font-medium text-black transition hover:from-amber-400 hover:to-amber-600"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Side by Side Layout */}
      <section className="relative min-h-screen overflow-hidden pt-20">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-950/10 via-[#0a0a0a] to-red-950/10" />
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] bg-gradient-to-bl from-amber-600/5 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] bg-gradient-to-tr from-red-900/10 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6">
          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left Side - Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-start text-left"
            >
              <motion.div
                variants={fadeInLeft}
                transition={{ duration: 0.6 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-sm text-amber-400"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                AI-Powered Tattoo Design
              </motion.div>

              <motion.h1
                variants={fadeInLeft}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
              >
                Visualize Your{" "}
                <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-red-500 bg-clip-text text-transparent">
                  Perfect Tattoo
                </span>{" "}
                Before the Ink
              </motion.h1>

              <motion.p
                variants={fadeInLeft}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400"
              >
                Upload a photo, generate unique AI designs, and preview exactly how
                your tattoo will look on your body. Make confident decisions before permanent ink.
              </motion.p>

              <motion.div
                variants={fadeInLeft}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-col gap-4 sm:flex-row"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/sign-up"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 px-8 py-4 font-medium text-black transition-all hover:shadow-lg hover:shadow-amber-500/20"
                  >
                    <span>Start Creating Free</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-medium text-white transition hover:border-amber-500/30 hover:bg-amber-500/5"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Browse Gallery
                  </Link>
                </motion.div>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={fadeInLeft}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8"
              >
                {[
                  { value: "10K+", label: "Designs Created" },
                  { value: "50+", label: "Styles" },
                  { value: "Free", label: "To Start" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - 3D Scene */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden h-[600px] lg:block"
            >
              {/* Glow effects */}
              <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-[100px]" />
              <div className="absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-red-600/10 blur-[80px]" />

              {/* 3D Scene Container */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
                className="relative h-full w-full overflow-hidden rounded-3xl border border-amber-900/20 bg-black/40"
              >
                <HeroScene />
                {/* Corner accents */}
                <div className="absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-amber-500/30 rounded-tl-3xl" />
                <div className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-amber-500/30 rounded-br-3xl" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs">Scroll to explore</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative py-32">
        {/* Background accent */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6">
          <AnimatedSection className="mb-16 text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-amber-500"
            >
              How It Works
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 text-3xl font-bold md:text-5xl"
            >
              From Idea to <span className="text-amber-400">Visualization</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-2xl text-gray-400"
            >
              Three simple steps to see your perfect tattoo
            </motion.p>
          </AnimatedSection>

          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              {
                step: "01",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Upload Your Photo",
                description: "Take a photo of your arm, back, or any body part where you want the tattoo placed.",
              },
              {
                step: "02",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Generate with AI",
                description: "Describe your dream tattoo and our AI creates unique designs tailored to your vision.",
              },
              {
                step: "03",
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                title: "Preview & Adjust",
                description: "Position, resize, and rotate the design on your photo. See exactly how it will look.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.step}
                variants={staggerItem}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-8 transition-all hover:border-amber-500/20 hover:bg-amber-500/5"
              >
                <div className="absolute -top-3 left-6 text-5xl font-bold text-amber-500/10">{feature.step}</div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Styles Preview Section */}
      <section ref={stylesRef} className="relative overflow-hidden py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-950/5 via-transparent to-amber-950/5" />

        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="mb-16 text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={stylesInView ? { opacity: 1 } : {}}
              className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-amber-500"
            >
              Tattoo Styles
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={stylesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="mb-4 text-3xl font-bold md:text-5xl"
            >
              Every Style <span className="text-amber-400">Imaginable</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={stylesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-2xl text-gray-400"
            >
              From minimalist linework to bold traditional, our AI creates stunning designs in any style
            </motion.p>
          </AnimatedSection>

          <motion.div
            initial={{ opacity: 0 }}
            animate={stylesInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              "Fine Line", "Blackwork", "Traditional", "Japanese",
              "Geometric", "Dotwork", "Watercolor", "Realism",
              "Tribal", "Neo-Traditional", "Minimalist", "Sketch",
            ].map((style, i) => (
              <motion.span
                key={style}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={stylesInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-300"
              >
                {style}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-8 rounded-3xl border border-amber-900/20 bg-gradient-to-r from-amber-950/10 via-black to-red-950/10 p-12 md:grid-cols-4"
          >
            {[
              { value: "10K+", label: "Designs Created" },
              { value: "500+", label: "Curated Templates" },
              { value: "50+", label: "Styles Available" },
              { value: "Free", label: "To Get Started" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : {}}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                  className="text-4xl font-bold text-amber-400 md:text-5xl"
                >
                  {stat.value}
                </motion.div>
                <div className="mt-2 text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber-950/10 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              Ready to See Your <span className="text-amber-400">Future Tattoo</span>?
            </h2>
            <p className="mb-10 text-lg text-gray-400">
              Join thousands of tattoo enthusiasts who visualize before they
              commit. Start creating for free today.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 px-10 py-5 text-lg font-medium text-black transition hover:shadow-lg hover:shadow-amber-500/25"
              >
                Get Started Free
                <motion.svg
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-between gap-6 sm:flex-row"
          >
            <div className="text-xl font-bold">
              Tattoo<span className="text-amber-500">AI</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              {["Gallery", "Generate", "Studio"].map((item) => (
                <motion.div key={item} whileHover={{ y: -2, color: "#f59e0b" }}>
                  <Link href={`/${item.toLowerCase()}`} className="transition">
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Tattoo AI Studio
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
