import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // 1. Update Supabase session
  const supabaseResponse = await updateSession(request);

  // 2. Handle i18n routing
  const response = handleI18nRouting(request);

  // 3. Merge cookies from Supabase response into the i18n response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie);
  });

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … system files (e.g. /_next)
    // - … static files (e.g. /favicon.ico)
    // - … metadata files (e.g. /robots.txt, /sitemap.xml)
    '/((?!api|_next|.*\\..*).*)',
  ],
};
