import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  const supabase = createRouteHandlerClient({ cookies });

  try {
    if (code) {
      // Intercambia el código por sesión
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.session) {
        // Limpiar cualquier token antiguo y redirigir a login
        await supabase.auth.signOut();
        return NextResponse.redirect(requestUrl.origin + '/login?error=invalid_session');
      }

      // Sesión válida, redirigir al dashboard
      return NextResponse.redirect(requestUrl.origin + '/dashboard');
    }

    // Sin código, redirigir a login
    return NextResponse.redirect(requestUrl.origin + '/login');
  } catch (err) {
    console.error('Error en callback auth:', err);
    await supabase.auth.signOut();
    return NextResponse.redirect(requestUrl.origin + '/login?error=server_error');
  }
}
