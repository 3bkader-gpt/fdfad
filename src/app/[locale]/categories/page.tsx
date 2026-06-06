import { createClient } from '@/lib/supabase/server';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Categories');
  const tc = await getTranslations('Common');

  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .schema('public')
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    return (
      <div className="bg-bg-main text-text-primary flex min-h-[70vh] flex-col items-center justify-center p-8">
        <h1 className="text-center font-serif text-2xl font-bold text-pretty">{tc('error')}</h1>
      </div>
    );
  }

  return (
    <main className="bg-bg-main text-text-primary min-h-screen pb-32 transition-colors duration-300">
      <header className="px-6 py-20 text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
          {t('subtitle')}
        </p>
      </header>

      <section className="mx-auto max-w-2xl px-6 text-start">
        {!categories || categories.length === 0 ? (
          <div className="py-24 text-center opacity-40">
            <p className="text-text-primary text-center font-serif text-lg italic">{t('empty')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {categories.map((category) => {
              const categoryName =
                (locale === 'ar' ? category.name_ar : category.name_en) || category.name;
              const categoryDescription =
                locale === 'ar' ? category.description_ar : category.description_en;
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group border-border-color bg-bg-elevated hover:border-brand-accent/30 flex flex-col justify-center rounded-2xl border p-8 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <h2 className="text-text-primary group-hover:text-brand-accent font-serif text-2xl font-bold tracking-tight transition-colors">
                        {categoryName}
                      </h2>
                      {categoryDescription && (
                        <p className="max-w-[90%] text-sm leading-relaxed opacity-60">
                          {categoryDescription}
                        </p>
                      )}
                    </div>
                    <div className="bg-bg-main border-border-color group-hover:bg-brand-accent/5 flex h-10 w-10 items-center justify-center rounded-full border transition-colors">
                      <ChevronRight className="text-text-primary group-hover:text-brand-accent h-5 w-5 opacity-40 transition-all group-hover:opacity-100 rtl:rotate-180" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
