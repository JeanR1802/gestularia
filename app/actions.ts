'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

/**
 * Crea un nuevo sitio para el usuario autenticado (Función Original).
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
 * Actualiza o crea el contenido de un sitio específico (Función Original).
 */
export async function updateSiteContent(siteId: string, content: string) {
  const supabase = createServerActionClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "No autenticado." };
  }

  const { data: site, error: siteError } = await supabase
    .from('sites')
    .select('id, name')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single();

  if (siteError || !site) {
    return { success: false, message: "No tienes permiso para editar este sitio." };
  }

  const { error } = await supabase.from('site_content').upsert(
    {
      site_id: siteId,
      content: JSON.parse(content),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'site_id',
    }
  );

  if (error) {
    console.error("Error al actualizar el contenido:", error);
    return { success: false, message: "No se pudieron guardar los cambios." };
  }

  revalidatePath(`/editor/${siteId}`);
  revalidatePath(`/s/${site.name}`);

  return { success: true, message: "¡Cambios guardados con éxito!" };
}

// ============================================================================
// FUNCIÓN CORREGIDA PARA CREAR SITIOS DESDE PLANTILLAS
// ============================================================================
export async function createSiteFromTemplate(
  prevState: { message: string, success?: boolean },
  formData: FormData
) {
  const supabase = createServerActionClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, message: 'No estás autenticado.' };
  }

  const subdomain = formData.get('subdomain') as string;
  const templateId = formData.get('templateId') as string;

  // --- Validación del subdominio (reutilizando tu lógica) ---
  if (!subdomain) {
    return { success: false, message: 'El nombre del subdominio es requerido.' };
  }
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (sanitizedSubdomain.length < 3) {
    return { success: false, message: 'El nombre debe tener al menos 3 caracteres.' };
  }
  if (sanitizedSubdomain !== subdomain) {
    return { success: false, message: 'El nombre solo puede contener letras minúsculas, números y guiones.' };
  }
  const { data: existingSite } = await supabase
    .from('sites')
    .select('id')
    .eq('name', sanitizedSubdomain)
    .single();
  if (existingSite) {
    return { success: false, message: 'Este nombre de subdominio ya está en uso.' };
  }
  if (!templateId) {
    return { success: false, message: 'No se seleccionó ninguna plantilla.' };
  }
  
  try {
    // 1. Leer el archivo de contenido inicial de la plantilla
    const filePath = path.join(process.cwd(), 'app', 'templates', templateId, 'initial-content.json');
    const templateContentString = await fs.readFile(filePath, 'utf8');
    const templateContent = JSON.parse(templateContentString);

    // 2. Crear el sitio en la tabla 'sites'
    const { data: newSite, error: siteError } = await supabase
      .from('sites')
      .insert({
        name: sanitizedSubdomain,
        user_id: session.user.id,
        template_name: templateId, // Guardamos el nombre de la plantilla
      })
      .select('id')
      .single();

    if (siteError || !newSite) {
      console.error('Error creating site:', siteError);
      return { success: false, message: 'Error al crear el registro del sitio.' };
    }

    // 3. Añadir el contenido inicial en la tabla 'site_content'
    const { error: contentError } = await supabase
      .from('site_content')
      .insert({
        site_id: newSite.id,
        content: templateContent,
      });

    if (contentError) {
      console.error('Error inserting content:', contentError);
      return { success: false, message: 'Error al guardar el contenido inicial.' };
    }

  } catch (error) {
    console.error('Error reading template file or processing creation:', error);
    return { success: false, message: 'No se pudo encontrar o procesar el archivo de la plantilla.' };
  }
  
  // 4. Refrescar el dashboard
  revalidatePath('/dashboard');
  
  // 5. Devolvemos un estado de éxito para que el cliente redirija
  return { success: true, message: '¡Sitio creado con éxito!' };
}