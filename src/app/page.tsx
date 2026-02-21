import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4 text-center">
        <Sparkles className="h-10 w-10 text-indigo-500" />
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Hello World
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          The Profile Hub — up and running 🚀
        </p>
      </div>
    </main>
  );
}
