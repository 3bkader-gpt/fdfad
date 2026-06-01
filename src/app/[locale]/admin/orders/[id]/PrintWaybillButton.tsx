'use client';

import { Printer } from 'lucide-react';

interface PrintWaybillButtonProps {
  label: string;
}

export function PrintWaybillButton({ label }: PrintWaybillButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border-border-color hover:bg-bg-main flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-[10px] font-bold tracking-widest uppercase opacity-60 transition-all hover:opacity-100"
    >
      <Printer className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
