import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Ambient glow matching main page */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 h-[800px] w-[1000px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary-500/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[600px] translate-y-1/4 rounded-full bg-primary-500/[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Logo */}
        <img
          src="/icon-192.png"
          alt="Armbian"
          width={64}
          height={64}
          className="mb-6 rounded-2xl"
        />

        {/* 404 indicator */}
        <span className="text-primary-500 mb-4 text-sm font-semibold tracking-widest uppercase">
          404
        </span>

        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Page not found
        </h1>

        <p className="text-muted-foreground mb-8 max-w-md text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Button variant="outline" size="lg" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
