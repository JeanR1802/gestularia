import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // --- INICIO DE LA MODIFICACIÓN ---
  // Define tu dominio raíz de producción aquí.
  const rootDomain = 'gestularia.com';
  // --- FIN DE LA MODIFICACIÓN ---

  // Manejo del entorno de desarrollo local
  if (hostname.endsWith('.localhost')) {
    return hostname.replace('.localhost', '');
  }

  // Manejo del entorno de producción
  if (
    hostname !== rootDomain &&
    hostname !== `www.${rootDomain}` &&
    hostname.endsWith(`.${rootDomain}`)
  ) {
    return hostname.replace(`.${rootDomain}`, '');
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // Lógica de autenticación (sin cambios)
  if (!session && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (session && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Lógica de subdominios (sin cambios)
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
