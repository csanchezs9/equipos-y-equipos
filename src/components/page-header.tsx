export function PageHeader({
  title,
  description,
}: {
  kicker?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pt-36 pb-16 md:pt-44 md:pb-24">
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 -z-10 h-[50vh] w-[70vw] -translate-x-1/2 rounded-full opacity-[0.1] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-brand) 0%, transparent 65%)",
        }}
      />
      <div className="container-x">
        <h1 className="display-lg max-w-[18ch]">{title}</h1>
        {description && (
          <p data-reveal="blur" className="mt-6 max-w-xl text-balance text-lg text-mute">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
