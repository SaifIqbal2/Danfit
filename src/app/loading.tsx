export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#08080a] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-red-600" />
        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-white/70">
          DanFit Industry
        </p>
      </div>
    </div>
  );
}
