// FILE: /app/editor/[siteId]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditorClient from '@/components/ui/EditorClient'; // Importamos el nuevo componente

type EditorPageProps = {
  params: {
    siteId: string;
  };
};

export default async function EditorPage({ params }: EditorPageProps) {
  const { siteId } = params;
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 1. Obtenemos la información del sitio para asegurarnos de que el usuario es el dueño.
  const { data: site } = await supabase
    .from('sites')
    .select('id, name')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single();

  if (!site) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No tienes permiso para ver este sitio o no existe.</p>
      </div>
    );
  }

  // 2. Obtenemos el contenido actual del sitio.
  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content')
    .eq('site_id', siteId)
    .single();

  // 3. Definimos un contenido por defecto si aún no se ha creado nada.
  const initialContent = siteContent?.content || {
    title: 'Título de tu Página',
    description: 'Empieza a escribir tu contenido aquí.',
  };

  return (
    <div>
      {/* Pasamos los datos a un Componente de Cliente que manejará la interactividad */}
      <EditorClient site={site} initialContent={initialContent} />
    </div>
  );
}
