import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // If keys are missing, we can't perform auth checks, so we just return the original response
  // to avoid crashing the whole application.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminPath =
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.match(/^\/(ar|en)\/admin($|\/)/);
  const isLoginPath =
    pathname === '/admin/login' || pathname.match(/^\/(ar|en)\/admin\/login($|\/)/);

  // If unauthenticated and trying to access admin routes (except login)
  if (!user && isAdminPath && !isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = isArabicPath(pathname) ? '/ar/admin/login' : '/admin/login';
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access login page
  if (user && isLoginPath) {
    const url = request.nextUrl.clone();
    url.pathname = isArabicPath(pathname) ? '/ar/admin' : '/admin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

function isArabicPath(pathname: string) {
  return pathname.startsWith('/ar');
}
