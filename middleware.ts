import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];
  const rootDomain = 'gestularia.com';

  if (hostname.endsWith('.localhost')) return hostname.replace('.localhost', '');
  if (hostname !== rootDomain && hostname !== `www.${rootDomain}` && hostname.endsWith(`.${rootDomain}`)) {
    return hostname.replace(`.${rootDomain}`, '');
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // SOLO obtener la sesión, no refrescar tokens constantemente
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // Redirección de rutas protegidas
  if (!session && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Evitar que usuario logueado vaya a login
  if (session && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Manejo de subdominios
  if (subdomain) {
    if (pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next|[\\w-]+\\.\\w+).*)',
  ],
};
