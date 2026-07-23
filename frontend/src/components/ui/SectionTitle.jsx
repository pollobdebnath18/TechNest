export default function SectionTitle({ title, subtitle, centered = true, className = "" }) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""} ${className}`}>
      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
