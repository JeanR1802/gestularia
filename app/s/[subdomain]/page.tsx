import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MinimaTemplate } from '@/app/templates/minima/components';

export default async function SitePage({
  params,
}: {
  params: { subdomain: string };
}) {
  const { subdomain } = params;
  const supabase = createServerComponentClient({ cookies });

  const { data: site } = await supabase
    .from('sites')
    .select('id, name, template_name')
    .eq('name', subdomain)
    .single();

  if (!site) notFound();

  const { data: siteContent } = await supabase
    .from('site_content')
    .select('content')
    .eq('site_id', site.id)
    .maybeSingle();

  let parsedContent;
  try {
    parsedContent =
      typeof siteContent?.content === 'string'
        ? JSON.parse(siteContent.content)
        : siteContent?.content;
  } catch {
    parsedContent = null;
  }

  const headerData = parsedContent?.header || { logoText: site.name, navLinks: [] };
  const blocks = parsedContent?.blocks || [
    { id: 'default-title', type: 'heading', content: `Bienvenido a ${site.name}` },
    {
      id: 'default-desc',
      type: 'paragraph',
      content: 'El contenido de este sitio aún no ha sido configurado.',
    },
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
              {block.type === 'heading' && <h2>{block.content}</h2>}
              {block.type === 'paragraph' && <p>{block.content}</p>}
            </div>
          ))}
        </div>
      );
  }
}
