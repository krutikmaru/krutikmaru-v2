import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6 py-24">
      <p className="text-muted font-mono text-sm">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        This page doesn&apos;t exist.
      </h1>
      <Link href="/" className="mt-6 text-sm underline underline-offset-4">
        Back home
      </Link>
    </main>
  );
}
