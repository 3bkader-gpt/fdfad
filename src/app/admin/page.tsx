export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#2C3E35]">Orders</h2>
        <p className="mt-1 text-sm text-[10px] tracking-widest text-[#2C3E35]/60 uppercase">
          Manage your customer fulfillments
        </p>
      </header>

      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#2C3E35]/20 bg-white p-12 text-center">
        <div className="rounded-full bg-[#FAFAFA] p-4 text-[#2C3E35]/40">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-[#2C3E35]/60">
          Orders placed by customers through the storefront will appear here automatically.
        </p>
      </div>
    </div>
  );
}
