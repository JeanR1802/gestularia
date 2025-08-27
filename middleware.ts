import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';

// La función extractSubdomain permanece igual, no necesita cambios.
function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }
    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

// --- INICIO DE LA MODIFICACIÓN ---
export async function middleware(request: NextRequest) {
  // Creamos una respuesta y el cliente de Supabase.
  // Esto es importante para que la sesión del usuario se refresque automáticamente.
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  // Obtenemos la sesión del usuario.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // --- LÓGICA DE AUTENTICACIÓN ---
  // 1. Proteger rutas si el usuario NO ha iniciado sesión.
  //    Si no hay sesión y el usuario intenta acceder a /admin o /dashboard,
  //    lo redirigimos a la página de login.
  if (!session && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Redirigir si el usuario YA ha iniciado sesión.
  //    Si ya hay una sesión y el usuario va a la página de login,
  //    lo redirigimos a su dashboard.
  if (session && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // --- LÓGICA DE SUBDOMINIOS (la que ya tenías) ---
  if (subdomain) {
    // Bloquear acceso a /admin desde un subdominio.
    if (pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // Reescribir la ruta raíz de un subdominio a la página correspondiente.
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }
  }

  // Si ninguna de las condiciones anteriores se cumple,
  // devolvemos la respuesta (que ya contiene las cookies de sesión actualizadas).
  return res;
}
// --- FIN DE LA MODIFICACIÓN ---

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)',
  ],
};
