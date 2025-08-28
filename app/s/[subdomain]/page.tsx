// FILE: /app/s/[subdomain]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { MinimaTemplate } from '@/app/templates/minima/components';

// ----------------------
// TIPOS
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
// FETCH DATA
// ----------------------
async function getSiteData(subdomain: string) {
  const supabase = createServerComponentClient({ cookies });

  const { data: site } = await supabase
    .from('sites')
    .select('id, name, template_name')
    .eq('name', subdomain)
    .single();

  if (!site) return null;

  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content')
    .eq('site_id', site.id)
    .maybeSingle();

  return { site, siteContent };
}

// ----------------------
// PAGE
// ----------------------
export default async function SitePage({ params }: any) {
  const { subdomain } = params;
  const data = await getSiteData(subdomain);

  if (!data) notFound();

  const { site, siteContent } = data;

  let parsedContent;
  try {
    parsedContent = typeof siteContent?.content === 'string'
      ? JSON.parse(siteContent.content)
      : siteContent?.content;
  } catch {
    parsedContent = null;
  }

  const headerData: HeaderContent = parsedContent?.header || { logoText: site.name, navLinks: [] };
  const blocks: Block[] = parsedContent?.blocks || [
    { id: 'default-title', type: 'heading', content: `Bienvenido a ${site.name}` },
    { id: 'default-desc', type: 'paragraph', content: 'El contenido de este sitio aún no ha sido configurado.' },
  ];

  switch (site.template_name) {
    case 'minima':
      return <MinimaTemplate header={headerData} blocks={blocks} />;

    default:
      return (
        <div>
          <h1>{headerData.logoText}</h1>
          <hr />
          {blocks.map(block => (
            <div key={block.id} style={{ marginTop: '20px' }}>
              {block.type === 'heading' && <h2>{(block as HeadingBlock).content}</h2>}
              {block.type === 'paragraph' && <p>{(block as ParagraphBlock).content}</p>}
            </div>
          ))}
        </div>
      );
  }
}
