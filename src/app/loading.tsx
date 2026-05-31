export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FAFAFA] text-[#2C3E35]">
      <div className="flex animate-pulse flex-col items-center gap-6">
        <h1 className="font-serif text-4xl font-bold tracking-tight opacity-20">فضفاض</h1>
        <div className="h-0.5 w-12 bg-[#C89B7E] opacity-40" />
        <p className="text-[10px] tracking-[0.3em] uppercase opacity-40">Unveiling curation...</p>
      </div>
    </div>
  );
}
