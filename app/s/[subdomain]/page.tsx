// FILE: /app/s/[subdomain]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'; // Importamos el tipo para Metadata

// Usamos el tipo de props que tu proyecto espera
type PageProps = {
  params: Promise<{
    subdomain: string;
  }>;
};

// Función auxiliar para obtener los datos del sitio
async function getSiteData(subdomain: string) {
  const supabase = createServerComponentClient({ cookies });
  const { data: site } = await supabase
    .from('sites')
    .select('id, name')
    .eq('name', subdomain)
    .single();

  if (!site) return null;

  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content')
    .eq('site_id', site.id)
    .single();
  
  return { site, siteContent };
}

// Generamos los metadatos (título de la página, descripción) dinámicamente
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getSiteData(subdomain);

  if (!data) {
    return { title: 'Página no encontrada' };
  }

  const content = data.siteContent?.content as { title?: string, description?: string } || {};

  return {
    title: content.title || `Bienvenido a ${data.site.name}`,
    description: content.description || 'Un sitio increíble creado con nuestra plataforma.',
  };
}


export default async function SitePage({ params }: PageProps) {
  // Usamos 'await' en los parámetros, como en tu código original
  const { subdomain } = await params;
  const data = await getSiteData(subdomain);

  if (!data) {
    notFound();
  }

  const { site, siteContent } = data;

  const content = siteContent?.content as { title?: string, description?: string } || {
    title: `Bienvenido a ${site.name}`,
    description: 'El contenido de este sitio aún no ha sido configurado.',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-xl text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">{content.title}</h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600">{content.description}</p>
      </div>
    </div>
  );
}
