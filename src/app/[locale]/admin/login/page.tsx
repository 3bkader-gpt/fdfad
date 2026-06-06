import { login } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="bg-bg-main text-text-primary flex min-h-screen flex-col items-center justify-center p-6 transition-colors duration-300">
      <div className="bg-bg-elevated ring-border-color w-full max-w-md rounded-xl p-8 shadow-sm ring-1">
        <header className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold tracking-tight">فضفاض</h1>
          <p className="mt-2 text-sm tracking-widest uppercase opacity-60">Admin Portal</p>
        </header>

        <form action={login} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-start">
            <label
              className="text-xs font-semibold tracking-wider uppercase opacity-70"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="bg-bg-main focus:ring-brand-accent/50 text-text-primary rounded-lg px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
              placeholder="owner@fdfad.com"
            />
          </div>

          <div className="flex flex-col gap-2 text-start">
            <label
              className="text-xs font-semibold tracking-wider uppercase opacity-70"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="bg-bg-main focus:ring-brand-accent/50 text-text-primary rounded-lg px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-xs font-medium text-red-600 ring-1 ring-red-100 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-900/40">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-brand-primary mt-2 rounded-lg py-3 text-sm font-bold tracking-widest text-white dark:text-bg-main uppercase transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-[10px] tracking-tighter uppercase opacity-40">
            Authorized Personnel Only
          </p>
        </footer>
      </div>
    </div>
  );
}
