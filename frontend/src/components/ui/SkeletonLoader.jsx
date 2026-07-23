export default function SkeletonLoader({ className = "", count = 1 }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-surface-alt"
          style={{ minHeight: "1rem" }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-white p-4">
      <div className="mb-4 h-48 rounded-lg bg-surface-alt" />
      <div className="mb-2 h-4 w-3/4 rounded bg-surface-alt" />
      <div className="mb-2 h-4 w-1/2 rounded bg-surface-alt" />
      <div className="h-6 w-1/4 rounded bg-surface-alt" />
    </div>
  );
}
