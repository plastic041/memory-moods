import Link from "next/link";
import { SearchLink } from "./search-input";

export default function HNLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex py-2 px-4 bg-primary">
        <Link prefetch={true} href="/">
          <h1 className="h1 text-primary-foreground">Next AI News</h1>
        </Link>
      </header>

      <main className="flex-grow bg-background container py-6 flex mx-auto px-4 md:px-8">
        {children}
      </main>

      <footer className="flex flex-col items-center justify-center p-4 border-t-2 border-t-secondary text-secondary-foreground bg-secondary">
        <div className="w-full max-w-md">
          <SearchLink />
        </div>
      </footer>
    </div>
  );
}
