import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditorClient from '@/components/ui/EditorClient';

export default async function EditorPage({
  params,
}: {
  params: { siteId: string };
}) {
  const { siteId } = params;
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: site } = await supabase
    .from('sites')
    .select('id, name')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single();

  if (!site)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No tienes permiso para ver este sitio o no existe.</p>
      </div>
    );

  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content')
    .eq('site_id', siteId)
    .maybeSingle();

  const content = siteContent?.content;

  const initialContent = {
    header:
      !Array.isArray(content) && content?.header
        ? content.header
        : { logoText: site.name, navLinks: [{ id: '1', text: 'Inicio', href: '#' }] },
    blocks: Array.isArray(content) ? content : content?.blocks || [],
  };

  return <EditorClient site={site} initialContent={initialContent} />;
}
