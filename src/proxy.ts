import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/lib/supabase/session';
import { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. Update Supabase session
  const supabaseResponse = await updateSession(request);

  // If updateSession returns a redirect, return it immediately
  if (
    supabaseResponse.status === 307 ||
    supabaseResponse.status === 308 ||
    supabaseResponse.headers.has('location')
  ) {
    return supabaseResponse;
  }

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
