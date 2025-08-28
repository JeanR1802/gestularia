// FILE: /app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  const supabase = createRouteHandlerClient({ cookies });

  try {
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.session) {
        // Si algo falla, limpiar cualquier token antiguo y redirigir a login
        await supabase.auth.signOut();
        return NextResponse.redirect(requestUrl.origin + '/login?error=invalid_session');
      }

      // Sesión válida, redirigir al dashboard
      return NextResponse.redirect(requestUrl.origin + '/dashboard');
    }

    // Si no hay código, redirigir a login
    return NextResponse.redirect(requestUrl.origin + '/login');
  } catch (err) {
    // Captura errores inesperados
    console.error('Error en callback auth:', err);
    await supabase.auth.signOut();
    return NextResponse.redirect(requestUrl.origin + '/login?error=server_error');
  }
}
