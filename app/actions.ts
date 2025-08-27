// FILE: /app/actions.ts
'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Crea un nuevo sitio para el usuario autenticado.
 * Compatible con el hook `useActionState` de React.
 */
export async function createSite(prevState: any, formData: FormData) {
  const supabase = createServerActionClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Error de autenticación. Por favor, inicia sesión de nuevo.' };
  }

  const subdomain = formData.get('subdomain') as string;

  if (!subdomain) {
    return { success: false, message: 'El nombre del sitio es requerido.' };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain.length < 3) {
      return { success: false, message: 'El nombre debe tener al menos 3 caracteres.' };
  }

  if (sanitizedSubdomain !== subdomain) {
    return {
      success: false,
      message: 'El nombre solo puede contener letras minúsculas, números y guiones.'
    };
  }

  const { data: existingSite } = await supabase
    .from('sites')
    .select('name')
    .eq('name', sanitizedSubdomain)
    .single();

  if (existingSite) {
    return { success: false, message: 'Este nombre de sitio ya está en uso.' };
  }

  const { error } = await supabase
    .from('sites')
    .insert({ name: sanitizedSubdomain, user_id: user.id });

  if (error) {
    console.error('Error al crear el sitio:', error);
    return { success: false, message: 'No se pudo crear el sitio. Inténtalo de nuevo.' };
  }

  revalidatePath('/dashboard');

  return { success: true, message: '¡Sitio creado con éxito!' };
}


/**
 * Actualiza o crea el contenido de un sitio específico.
 */
export async function updateSiteContent(siteId: string, content: string) {
  const supabase = createServerActionClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "No autenticado." };
  }

  // Verificamos que el usuario sea el dueño del sitio que intenta editar.
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .select('id, name')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single();

  if (siteError || !site) {
    return { success: false, message: "No tienes permiso para editar este sitio." };
  }

  // Usamos 'upsert' para crear el contenido si no existe, o actualizarlo si ya existe.
  const { error } = await supabase.from('site_content').upsert(
    {
      site_id: siteId,
      content: JSON.parse(content),
      updated_at: new Date().toISOString(), // Buena práctica: actualizar la fecha de modificación
    },
    {
      // AÑADIMOS ESTA LÍNEA: Le dice a Supabase que si ya existe una fila
      // con este 'site_id', debe actualizarla en lugar de crear una nueva.
      onConflict: 'site_id',
    }
  );

  if (error) {
    console.error("Error al actualizar el contenido:", error);
    return { success: false, message: "No se pudieron guardar los cambios." };
  }

  // Revalidamos la caché para que los cambios se vean al instante.
  revalidatePath(`/editor/${siteId}`);
  revalidatePath(`/s/${site.name}`);

  return { success: true, message: "¡Cambios guardados con éxito!" };
}
