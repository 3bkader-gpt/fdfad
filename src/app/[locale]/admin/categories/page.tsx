import { createClient } from '@/lib/supabase/server';
import { CategoryManagerClient } from './CategoryManagerClient';
import { setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const { data: categories, error } = await supabase.from('categories').select('*').order('name');

  if (error) {
    return <div className="text-text-primary">Error loading categories: {error.message}</div>;
  }

  return (
    <div className="text-text-primary flex flex-col gap-10 text-start">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-4xl font-bold tracking-tight">Categories</h2>
          <p className="mt-2 text-[10px] font-bold tracking-widest uppercase opacity-60">
            Organize your modest collection
          </p>
        </div>
      </header>

      <CategoryManagerClient initialCategories={categories || []} />
    </div>
  );
}
