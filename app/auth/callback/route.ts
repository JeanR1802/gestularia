// FILE: /app/auth/callback/route.ts
// Esta ruta es necesaria para que Supabase pueda redirigir al usuario
// después de confirmar su correo electrónico.

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL a la que redirigir al usuario después de iniciar sesión
  return NextResponse.redirect(requestUrl.origin + '/dashboard');
}
