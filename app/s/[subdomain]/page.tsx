// FILE: /app/s/[subdomain]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// --- PASO 1: Importamos los componentes de nuestra plantilla ---
import { MinimaTemplate } from '@/app/templates/minima/components';

// ============================================================================
// TIPOS DE DATOS MEJORADOS Y CONSISTENTES
// ============================================================================

// Usamos los mismos tipos robustos que en el editor para evitar errores.
type PageProps = { params: { subdomain: string; }; };
type HeroBlockContent = { heading: string; subheading: string; image: string; styles: { textAlignment: 'left' | 'center' | 'right'; verticalAlignment: 'start' | 'center' | 'end'; };};
type ImageBlockContent = { src: string; alt: string };
type HeadingBlock = { id: string; type: 'heading'; content: string };
type ParagraphBlock = { id: string; type: 'paragraph'; content: string };
type ImageBlock = { id: string; type: 'image'; content: ImageBlockContent };
type HeroBlock = { id: string; type: 'hero'; content: HeroBlockContent };
type Block = HeadingBlock | ParagraphBlock | ImageBlock | HeroBlock;
type NavLink = { id: string; text: string; href: string; };
type HeaderContent = { logoText: string; navLinks: NavLink[]; };
type PageContent = { header: HeaderContent; blocks: Block[]; };

// ============================================================================
// LÓGICA DE FETCHING ACTUALIZADA
// ============================================================================

async function getSiteData(subdomain: string) {
  const supabase = createServerComponentClient({ cookies });

  // --- PASO 2: Pedimos también el 'template_name' de la base de datos ---
  const { data: site } = await supabase
    .from('sites')
    .select('id, name, template_name') // <-- CAMBIO CLAVE
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // ... (Esta función seguirá funcionando sin cambios)
    const { subdomain } = params;
    const data = await getSiteData(subdomain);

    if (!data) {
    return { title: 'Página no encontrada' };
    }

    const content = data.siteContent?.content as PageContent | Block[];
    const blocks = Array.isArray(content) ? content : content?.blocks || [];
    const firstHeading = blocks.find(block => block.type === 'heading');

    return {
    title: (firstHeading?.content as string) || `Bienvenido a ${data.site.name}`,
    description: 'Un sitio increíble creado con nuestra plataforma.',
    };
}


// ============================================================================
// PÁGINA PRINCIPAL DEL SITIO (AHORA DINÁMICA)
// ============================================================================

export default async function SitePage({ params }: PageProps) {
  const { subdomain } = params;
  const data = await getSiteData(subdomain);

  if (!data) {
    notFound();
  }

  const { site, siteContent } = data;

  // Lógica segura para parsear el contenido
  let parsedContent;
  try {
    parsedContent = typeof siteContent?.content === 'string' 
      ? JSON.parse(siteContent.content) 
      : siteContent?.content;
  } catch (error) {
    parsedContent = null;
  }

  const headerData: HeaderContent = parsedContent?.header || { logoText: site.name, navLinks: [] };
  const blocks: Block[] = parsedContent?.blocks || [
    { id: 'default-title', type: 'heading', content: `Bienvenido a ${site.name}` },
    { id: 'default-desc', type: 'paragraph', content: 'El contenido de este sitio aún no ha sido configurado.' },
  ];

  // --- PASO 3: Lógica para renderizar la plantilla correcta ---
  // Usamos un 'switch' para decidir qué diseño mostrar. A futuro,
  // puedes añadir más 'case' para más plantillas.
  switch (site.template_name) {
    case 'minima':
      return <MinimaTemplate header={headerData} blocks={blocks} />;

    default:
      // Un diseño básico por si la plantilla no se encuentra
      return (
        <div>
          <h1>{headerData.logoText}</h1>
          <hr />
          {blocks.map(block => (
            <div key={block.id} style={{ marginTop: '20px' }}>
              {block.type === 'heading' && <h2>{(block as HeadingBlock).content}</h2>}
              {block.type === 'paragraph' && <p>{(block as ParagraphBlock).content}</p>}
              {/* Añadir más renderizado básico si es necesario */}
            </div>
          ))}
        </div>
      );
  }
}