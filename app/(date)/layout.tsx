export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <div
        className="flex flex-grow px-4 py-6 md:px-8"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(245,251,245,1), rgba(251,254,251,1)),
	url(noise.svg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
