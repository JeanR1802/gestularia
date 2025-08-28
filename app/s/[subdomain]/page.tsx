// FILE: /app/s/[subdomain]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MinimaTemplate } from '@/app/templates/minima/components';

// ----------------------
// TIPOS DE BLOQUES
// ----------------------
type HeadingBlock = { id: string; type: 'heading'; content: string };
type ParagraphBlock = { id: string; type: 'paragraph'; content: string };
type ImageBlock = { id: string; type: 'image'; content: { src: string; alt: string } };
type HeroBlock = { id: string; type: 'hero'; content: any }; // ajusta según tus datos reales

type Block = HeadingBlock | ParagraphBlock | ImageBlock | HeroBlock;

type HeaderContent = { logoText: string; navLinks: { id: string; text: string; href: string }[] };
type PageContent = { header: HeaderContent; blocks: Block[] };

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
// METADATA
// ----------------------
export async function generateMetadata({
  params,
}: {
  params: { subdomain: string };
}): Promise<Metadata> {
  const { subdomain } = params;
  const data = await getSiteData(subdomain);

  if (!data) return { title: 'Página no encontrada' };

  const content = data.siteContent?.content as PageContent | Block[];
  const blocks = Array.isArray(content) ? content : content?.blocks || [];
  const firstHeading = blocks.find(block => block.type === 'heading') as HeadingBlock | undefined;

  return {
    title: firstHeading?.content || `Bienvenido a ${data.site.name}`,
    description: 'Un sitio increíble creado con nuestra plataforma.',
  };
}

// ----------------------
// PÁGINA PRINCIPAL
// ----------------------
export default async function SitePage({
  params,
}: {
  params: { subdomain: string };
}) {
  const { subdomain } = params;
  const data = await getSiteData(subdomain);

  if (!data) notFound();

  const { site, siteContent } = data;

  // Parseamos el contenido
  let parsedContent: PageContent | Block[] | null;
  try {
    parsedContent =
      typeof siteContent?.content === 'string'
        ? JSON.parse(siteContent.content)
        : siteContent?.content;
  } catch {
    parsedContent = null;
  }

  // ----------------------
  // TIPADO SEGURO PARA HEADER Y BLOCKS
  // ----------------------
  let headerData: HeaderContent;
  let blocks: Block[];

  if (parsedContent && !Array.isArray(parsedContent)) {
    // parsedContent es PageContent
    headerData = parsedContent.header;
    blocks = parsedContent.blocks;
  } else {
    // parsedContent es null o Block[]
    headerData = { logoText: site.name, navLinks: [] };
    blocks = Array.isArray(parsedContent)
      ? parsedContent
      : [
          { id: 'default-title', type: 'heading', content: `Bienvenido a ${site.name}` },
          { id: 'default-desc', type: 'paragraph', content: 'El contenido de este sitio aún no ha sido configurado.' },
        ];
  }

  // ----------------------
  // Render de la plantilla
  // ----------------------
  switch (site.template_name) {
    case 'minima':
      return <MinimaTemplate header={headerData} blocks={blocks} />;

    default:
      return (
        <div>
          <h1>{headerData.logoText}</h1>
          <hr />
          {blocks.map(block => {
            switch (block.type) {
              case 'heading':
                return <h2 key={block.id}>{block.content}</h2>;
              case 'paragraph':
                return <p key={block.id}>{block.content}</p>;
              case 'image':
                return <img key={block.id} src={block.content.src} alt={block.content.alt} />;
              case 'hero':
                return <div key={block.id}>[Hero Block]</div>; // Ajusta según tu plantilla
              default:
                return null;
            }
          })}
        </div>
      );
  }
}
