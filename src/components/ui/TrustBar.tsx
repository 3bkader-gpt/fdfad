import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export function TrustBar() {
  return (
    <div className="border-y border-[#2C3E35]/5 bg-white px-6 py-4">
      <div className="no-scrollbar mx-auto flex max-w-2xl items-center justify-between gap-4 overflow-x-auto">
        <div className="flex shrink-0 items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#4A7C59]" />
          <span className="text-[9px] font-bold tracking-widest uppercase opacity-70">
            Secure COD
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Truck className="h-4 w-4 text-[#C89B7E]" />
          <span className="text-[9px] font-bold tracking-widest uppercase opacity-70">
            Fast Delivery
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <RotateCcw className="h-4 w-4 text-[#2C3E35]" />
          <span className="text-[9px] font-bold tracking-widest uppercase opacity-70">
            14-Day Returns
          </span>
        </div>
      </div>
    </div>
  );
}
