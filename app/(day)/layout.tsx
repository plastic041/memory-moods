export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <main className="container mx-auto flex flex-grow bg-background px-4 py-6 md:px-8">
        {children}
      </main>
    </div>
  );
}
