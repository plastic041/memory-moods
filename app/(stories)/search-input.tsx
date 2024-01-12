"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SearchLink() {
  const pathname = usePathname();
  const router = useRouter();

  // capture the `/` keyboard shortcut
  useKey("/", () => {
    router.push("/search");
  });

  return (
    <Link
      href="/search"
      prefetch={true}
      className={cn(
        "flex items-center h-9 w-full rounded-md border border-zinc-200 bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
        { hidden: pathname === "/search" }
      )}
    >
      <span>Search…</span>
    </Link>
  );
}

function useKey(key: String, fn: Function) {
  useEffect(() => {
    const handler = function (event: KeyboardEvent) {
      if (event.key === key) {
        fn();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [key, fn]);
}
