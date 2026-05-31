import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAFAFA] p-8 text-center text-[#2C3E35]">
      <h2 className="mb-4 font-serif text-6xl font-bold tracking-tighter opacity-10">404</h2>
      <h1 className="font-serif text-2xl font-bold tracking-tight">The Path Has Vanished</h1>
      <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-60">
        The curated item or page you are seeking is currently beyond our reach. It may have been
        moved or is yet to be unveiled.
      </p>
      <Link
        href="/"
        className="mt-12 rounded-full bg-[#2C3E35] px-10 py-4 text-[10px] font-bold tracking-widest text-white uppercase shadow-2xl shadow-[#2C3E35]/20 transition-all hover:bg-[#1E2B25] active:scale-95"
      >
        Return to Boutique
      </Link>
    </div>
  );
}
