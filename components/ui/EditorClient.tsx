// FILE: /components/EditorClient.tsx
'use client';

import { useState } from 'react';
import { updateSiteContent } from '@/app/actions';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

// --- Tipos de Datos (Actualizados) ---
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

type EditorClientProps = {
  site: { id: string; name: string };
  initialContent: PageContent;
};

export default function EditorClient({ site, initialContent }: EditorClientProps) {
  const [header, setHeader] = useState<HeaderContent>(initialContent.header || { logoText: site.name, navLinks: [] });
  const [blocks, setBlocks] = useState<Block[]>(initialContent.blocks || []);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- Funciones para manejar el Encabezado ---
  const handleHeaderChange = (field: 'logoText', value: string) => {
    setHeader(prev => ({ ...prev, [field]: value }));
  };

  const handleNavLinkChange = (id: string, field: 'text' | 'href', value: string) => {
    setHeader(prev => ({
      ...prev,
      navLinks: prev.navLinks.map(link => link.id === id ? { ...link, [field]: value } : link)
    }));
  };

  const addNavLink = () => {
    setHeader(prev => ({
      ...prev,
      navLinks: [...(prev.navLinks || []), { id: crypto.randomUUID(), text: 'Nuevo Enlace', href: '#' }]
    }));
  };

  const deleteNavLink = (id: string) => {
    setHeader(prev => ({
      ...prev,
      navLinks: prev.navLinks.filter(link => link.id !== id)
    }));
  };

  // --- Funciones para manejar los Bloques ---
  const addBlock = (type: Block['type']) => {
    let newBlock: Block;
    if (type === 'image') {
      newBlock = {
        id: crypto.randomUUID(),
        type,
        content: { src: 'https://placehold.co/1200x600?text=Nueva+Imagen', alt: 'Descripción de la imagen' },
      };
    } else {
      newBlock = {
        id: crypto.randomUUID(),
        type,
        content: type === 'heading' ? 'Nuevo Encabezado' : 'Este es un nuevo párrafo.',
      };
    }
    setBlocks([...blocks, newBlock]);
  };

  const updateBlockContent = (id: string, newContent: BlockContent) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content: newContent } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    setMessage('Guardando...');
    const fullContent: PageContent = { header, blocks };
    const result = await updateSiteContent(site.id, JSON.stringify(fullContent));
    setMessage(result.message);
    setIsSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Panel de Edición */}
      <aside className="w-1/3 bg-white p-6 border-r flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Editor Visual</h2>
          <Link href="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-gray-800">
            <ArrowLeft size={16} className="mr-1" />
            Dashboard
          </Link>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
          {/* --- SECCIÓN: CONFIGURACIÓN DEL ENCABEZADO --- */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Encabezado</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600">Texto del Logo</label>
                <input
                  type="text"
                  value={header.logoText}
                  onChange={(e) => handleHeaderChange('logoText', e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-2 block">Enlaces de Navegación</label>
                <div className="space-y-2">
                  {(header.navLinks || []).map(link => (
                    <div key={link.id} className="flex items-center gap-2">
                      <input type="text" placeholder="Texto" value={link.text} onChange={e => handleNavLinkChange(link.id, 'text', e.target.value)} className="w-1/2 p-1 border rounded-md text-xs" />
                      <input type="text" placeholder="URL" value={link.href} onChange={e => handleNavLinkChange(link.id, 'href', e.target.value)} className="w-1/2 p-1 border rounded-md text-xs" />
                      <button onClick={() => deleteNavLink(link.id)} className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addNavLink} className="mt-2 text-xs flex items-center justify-center gap-1 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1.5 rounded-md">
                  <Plus size={14} /> Añadir Enlace
                </button>
              </div>
            </div>
          </div>

          {/* --- SECCIÓN DE BLOQUES DE CONTENIDO --- */}
          {blocks.map((block) => (
            <div key={block.id} className="p-4 border rounded-lg bg-gray-50 relative group">
              <label className="block text-xs font-medium text-gray-500 mb-2 capitalize">
                {block.type === 'heading' ? 'Encabezado' : block.type === 'paragraph' ? 'Párrafo' : 'Imagen'}
              </label>

              {block.type === 'heading' && (
                <input type="text" value={block.content as string} onChange={(e) => updateBlockContent(block.id, e.target.value)} className="w-full p-2 border rounded-md text-lg font-bold" />
              )}

              {block.type === 'paragraph' && (
                <textarea value={block.content as string} onChange={(e) => updateBlockContent(block.id, e.target.value)} rows={4} className="w-full p-2 border rounded-md text-sm" />
              )}

              {block.type === 'image' && (() => {
                const imageContent = block.content as { src: string; alt: string };
                return (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600">URL de la Imagen</label>
                      <input type="text" value={imageContent.src} onChange={(e) => updateBlockContent(block.id, { ...imageContent, src: e.target.value })} className="w-full p-2 border rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Texto Alternativo</label>
                      <input type="text" value={imageContent.alt} onChange={(e) => updateBlockContent(block.id, { ...imageContent, alt: e.target.value })} className="w-full p-2 border rounded-md text-sm" />
                    </div>
                  </div>
                );
              })()}

              <button onClick={() => deleteBlock(block.id)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
           <div className="grid grid-cols-3 gap-2 mb-4">
            <button onClick={() => addBlock('heading')} className="text-xs flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-2 rounded-md">
              <Plus size={14} /> Encabezado
            </button>
            <button onClick={() => addBlock('paragraph')} className="text-xs flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-2 rounded-md">
              <Plus size={14} /> Párrafo
            </button>
            <button onClick={() => addBlock('image')} className="text-xs flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-2 rounded-md">
              <Plus size={14} /> Imagen
            </button>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {message && <p className="mt-2 text-sm text-center">{message}</p>}
        </div>
      </aside>

      {/* Previsualización en vivo */}
      <main className="w-2/3 p-10">
        <Header content={header} />
        <div className="bg-white p-12 rounded-lg shadow-lg mt-8">
          {blocks.map(block => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </main>
    </div>
  );
}

// --- Componentes de Renderizado para la Previsualización ---

function Header({ content }: { content: HeaderContent }) {
  return (
    <header className="bg-white shadow-md rounded-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">
          {content.logoText || 'Mi Sitio'}
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {(content.navLinks || []).map(link => (
            <a key={link.id} href={link.href} className="text-gray-600 hover:text-blue-600 transition-colors">
              {link.text}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      return <h1 className="text-4xl font-bold text-gray-800 mt-6 first:mt-0">{block.content as string}</h1>;
    case 'paragraph':
      return <p className="mt-4 text-gray-600 whitespace-pre-wrap">{block.content as string}</p>;
    case 'image':
      const { src, alt } = block.content as { src: string; alt: string };
      return <img src={src || 'https://placehold.co/1200x600?text=Imagen'} alt={alt || 'Imagen'} className="w-full h-auto rounded-lg shadow-md mt-6" />;
    default:
      return null;
  }
}
