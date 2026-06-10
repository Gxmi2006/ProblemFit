export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-radial-field" />
      <div className="grid-bg absolute inset-0 opacity-80" />
      <div className="absolute left-1/4 top-20 h-64 w-64 rounded-full bg-aqua/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/5 h-72 w-72 rounded-full bg-ember/10 blur-3xl" />
    </div>
  );
}
