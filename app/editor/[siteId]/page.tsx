// FILE: /app/editor/[siteId]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditorClient from '@/components/ui/EditorClient';

// ----------------------
// TIPOS INTERNOS
// ----------------------
type HeadingBlock = { id: string; type: 'heading'; content: string };
type ParagraphBlock = { id: string; type: 'paragraph'; content: string };
type ImageBlock = { id: string; type: 'image'; content: { src: string; alt: string } };
type HeroBlock = { id: string; type: 'hero'; content: any };
type Block = HeadingBlock | ParagraphBlock | ImageBlock | HeroBlock;

type HeaderContent = {
  logoText: string;
  navLinks: { id: string; text: string; href: string }[];
};

type PageContent = {
  header: HeaderContent;
  blocks: Block[];
};

// ----------------------
// PÁGINA PRINCIPAL
// ----------------------
export default async function EditorPage({ params }: any) {
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

  const content = siteContent?.content;

  let initialContent: PageContent;
  if (content && !Array.isArray(content)) {
    initialContent = {
      header: content.header,
      blocks: content.blocks || [],
    };
  } else {
    initialContent = {
      header: { logoText: site.name, navLinks: [{ id: '1', text: 'Inicio', href: '#' }] },
      blocks: Array.isArray(content) ? content : [],
    };
  }

  return <EditorClient site={site} initialContent={initialContent} />;
}
