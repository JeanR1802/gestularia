// FILE: /app/editor/[siteId]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditorClient from '@/components/ui/EditorClient';

// CORRECCIÓN: Ajustamos el tipo de 'params' para que sea una Promesa,
// como lo espera tu configuración de Next.js.
type EditorPageProps = {
  params: Promise<{
    siteId: string;
  }>;
};

export default async function EditorPage({ params }: EditorPageProps) {
  // CORRECCIÓN: Usamos 'await' para obtener el valor de los parámetros.
  const { siteId } = await params;
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

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

  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content')
    .eq('site_id', siteId)
    .maybeSingle();

  const initialContent = siteContent?.content || [];

  return (
    <div>
      <EditorClient site={site} initialContent={initialContent} />
    </div>
  );
}
