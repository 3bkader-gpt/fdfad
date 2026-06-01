import { createClient } from '@/lib/supabase/server';
import { CategoryManagerClient } from './CategoryManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase.from('categories').select('*').order('name');

  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-10 text-left">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-4xl font-bold tracking-tight text-[#2C3E35]">
            Categories
          </h2>
          <p className="mt-2 text-[10px] font-bold tracking-widest text-[#2C3E35]/60 uppercase">
            Organize your modest collection
          </p>
        </div>
      </header>

      <CategoryManagerClient initialCategories={categories || []} />
    </div>
  );
}
