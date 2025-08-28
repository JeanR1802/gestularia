// FILE: /app/s/[subdomain]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
// --- INICIO DE LA CORRECCIÓN ---
// Importamos los nuevos componentes de bloque desde sus archivos
import HeadingBlock from '@/components/site-blocks/HeadingBlock';
import ParagraphBlock from '@/components/site-blocks/ParagraphBlock';
import ImageBlock from '@/components/site-blocks/ImageBlock';
// --- FIN DE LA CORRECCIÓN ---

// ============================================================================
// TIPOS DE DATOS Y LÓGICA DE FETCHING
// ============================================================================

type PageProps = {
  params: Promise<{
    subdomain: string;
  }>;
};

type BlockContent = string | { src: string; alt: string };
type Block = {
  id: string;
  type: 'heading' | 'paragraph' | 'image';
  content: BlockContent;
};

type NavLink = {
  id: string;
  text: string;
  href: string;
};
type HeaderContent = {
  logoText: string;
  navLinks: NavLink[];
};

type PageContent = {
  header: HeaderContent;
  blocks: Block[];
};


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
    .maybeSingle();
  
  return { site, siteContent };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subdomain } = await params;
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
// COMPONENTES DE RENDERIZADO
// ============================================================================

function Header({ content }: { content: HeaderContent }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">
          {content.logoText || 'Mi Sitio'}
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {(content.navLinks || []).map(link => (
            <Link key={link.id} href={link.href} className="text-gray-600 hover:text-blue-600 transition-colors">
              {link.text}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      // @ts-ignore - TypeScript a veces tiene problemas con uniones complejas aquí
      return <HeadingBlock block={block} />;
    case 'paragraph':
      // @ts-ignore
      return <ParagraphBlock block={block} />;
    case 'image':
      // @ts-ignore
      return <ImageBlock block={block} />;
    default:
      return null;
  }
}

// ============================================================================
// PÁGINA PRINCIPAL DEL SITIO
// ============================================================================

export default async function SitePage({ params }: PageProps) {
  const { subdomain } = await params;
  const data = await getSiteData(subdomain);

  if (!data) {
    notFound();
  }

  const { site, siteContent } = data;

  const content = siteContent?.content as PageContent | Block[];
  
  const headerData: HeaderContent = !Array.isArray(content) && content?.header
    ? content.header
    : { logoText: site.name, navLinks: [] };

  const blocks: Block[] = Array.isArray(content)
    ? content
    : content?.blocks || [
        { id: 'default-title', type: 'heading', content: `Bienvenido a ${site.name}` },
        { id: 'default-desc', type: 'paragraph', content: 'El contenido de este sitio aún no ha sido configurado.' },
      ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header content={headerData} />

      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg">
          {blocks.map(block => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </main>

      <footer className="bg-white mt-8">
        <div className="container mx-auto px-6 py-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</p>
          <p className="mt-1">Creado con Gestularia</p>
        </div>
      </footer>
    </div>
  );
}
