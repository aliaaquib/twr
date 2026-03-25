export default function Loading() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[32px] border border-line bg-white p-12 text-center shadow-card">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
      <p className="mt-5 text-base text-muted">Loading the latest stories...</p>
    </div>
  );
}
