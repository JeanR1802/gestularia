'use client';

import { useState, useEffect } from 'react';
import { updateSiteContent } from '@/app/actions';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Sun, Moon, Eye, Edit } from 'lucide-react';
import { useTheme } from 'next-themes';
import { MinimaTemplate } from '@/app/templates/minima/components';

// ============================================================================
// TIPOS DE DATOS (CON TODOS LOS BLOQUES)
// ============================================================================
type HeroBlockContent = { heading: string; subheading: string; image: string; styles: { textAlignment: 'left' | 'center' | 'right'; verticalAlignment: 'start' | 'center' | 'end'; };};
type ImageBlockContent = { src: string; alt: string };
type Feature = { id: string; icon: string; title: string; description: string; };
type FeaturesBlockContent = { heading: string; subheading: string; features: Feature[]; };
type CtaBlockContent = { heading: string; subheading: string; buttonText: string; buttonHref: string; };

type HeadingBlock = { id: string; type: 'heading'; content: string };
type ParagraphBlock = { id: string; type: 'paragraph'; content: string };
type ImageBlock = { id: string; type: 'image'; content: ImageBlockContent };
type HeroBlock = { id: string; type: 'hero'; content: HeroBlockContent };
type FeaturesBlock = { id: string; type: 'features'; content: FeaturesBlockContent };
type CtaBlock = { id: string; type: 'cta'; content: CtaBlockContent };

type Block = HeadingBlock | ParagraphBlock | ImageBlock | HeroBlock | FeaturesBlock | CtaBlock;

type NavLink = { id: string; text: string; href: string; };
type HeaderContent = { logoText: string; navLinks: NavLink[]; };
type PageContent = { header: HeaderContent; blocks: Block[]; };
type EditorClientProps = { site: { id: string; name: string }; initialContent: PageContent; };

// ============================================================================
// COMPONENTE PRINCIPAL DEL EDITOR
// ============================================================================
const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return (
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 transition-colors">
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
    );
};

export default function EditorClient({ site, initialContent }: EditorClientProps) {
    const [header, setHeader] = useState<HeaderContent>(initialContent.header || { logoText: site.name, navLinks: [] });
    const [blocks, setBlocks] = useState<Block[]>(initialContent.blocks || []);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(true);

    const handleHeaderChange = (field: 'logoText', value: string) => setHeader(prev => ({ ...prev, [field]: value }));
    const handleNavLinkChange = (id: string, field: 'text' | 'href', value: string) => setHeader(prev => ({ ...prev, navLinks: prev.navLinks.map(link => link.id === id ? { ...link, [field]: value } : link) }));
    const addNavLink = () => setHeader(prev => ({ ...prev, navLinks: [...(prev.navLinks || []), { id: crypto.randomUUID(), text: 'Nuevo Enlace', href: '#' }] }));
    const deleteNavLink = (id: string) => setHeader(prev => ({ ...prev, navLinks: prev.navLinks.filter(link => link.id !== id) }));

    const addBlock = (type: Block['type']) => {
        let newBlock: Block;
        switch (type) {
            case 'image': newBlock = { id: crypto.randomUUID(), type, content: { src: 'https://images.unsplash.com/photo-1723176161476-de8b85843422?q=80&w=2592', alt: 'Descripción de imagen' } }; break;
            case 'hero': newBlock = { id: crypto.randomUUID(), type, content: { heading: 'Título Impactante', subheading: 'Un subtítulo que engancha al lector.', image: 'https://images.unsplash.com/photo-1722513322430-5627798a3788?q=80&w=2574', styles: { textAlignment: 'center', verticalAlignment: 'center' } } }; break;
            case 'heading': newBlock = { id: crypto.randomUUID(), type, content: 'Nuevo Título' }; break;
            case 'paragraph': newBlock = { id: crypto.randomUUID(), type, content: 'Este es un nuevo párrafo.' }; break;
            case 'features': newBlock = { id: crypto.randomUUID(), type, content: { heading: 'Características Principales', subheading: 'Descubre todo lo que nuestro producto puede hacer por ti.', features: [{ id: crypto.randomUUID(), icon: 'Rocket', title: 'Desarrollo Rápido', description: 'Lanza tu sitio en minutos, no en meses.' },{ id: crypto.randomUUID(), icon: 'ShieldCheck', title: 'Seguro y Confiable', description: 'Con la mejor seguridad para proteger tus datos.' },{ id: crypto.randomUUID(), icon: 'Smartphone', title: 'Totalmente Responsivo', description: 'Tu sitio se verá increíble en cualquier dispositivo.' }]}}; break;
            case 'cta':
                newBlock = {
                    id: crypto.randomUUID(), type,
                    content: {
                        heading: '¿Listo para Empezar?',
                        subheading: 'Únete a miles de usuarios que ya están construyendo su futuro con nosotros.',
                        buttonText: 'Crear Mi Sitio Ahora',
                        buttonHref: '#',
                    }
                };
                break;
        }
        setBlocks(prev => [...prev, newBlock]);
    };

    const updateBlock = <T extends Block>(id: string, newContent: T['content']) => { setBlocks(blocks.map(block => block.id === id ? { ...block, content: newContent } : block)); };
    const deleteBlock = (id: string) => { setBlocks(blocks.filter(block => block.id !== id)); };
    
    const handleSave = async () => {
        setIsSaving(true);
        setMessage('Guardando...');
        const fullContent: PageContent = { header, blocks: JSON.parse(JSON.stringify(blocks)) };
        const jsonContent = JSON.stringify(fullContent, null, 2);
        try {
          const result = await updateSiteContent(site.id, jsonContent);
          // @ts-ignore
          setMessage(result.message);
        } catch (error) {
          console.error("Error saving content:", error);
          setMessage('Error al guardar el contenido.');
        }
        setIsSaving(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="relative md:flex md:flex-row h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            {/* Panel de Edición */}
            <aside className={`w-full h-screen bg-white dark:bg-slate-800 p-4 md:p-6 border-b md:border-b-0 md:border-r dark:border-slate-700 flex flex-col md:w-[400px] md:h-full ${isEditing ? 'flex' : 'hidden md:flex'}`}>
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Editor del Sitio</h2>
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />
                        <Link href="/dashboard" className="flex items-center text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-slate-200"><ArrowLeft size={16} className="mr-1" /> Panel</Link>
                    </div>
                </div>

                <div className="flex-grow pr-2 -mr-2 space-y-5 overflow-y-auto">
                    {/* Editor del Header */}
                    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50 dark:border-slate-700">
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3">Encabezado</h3>
                        <div className="space-y-4">
                            <div><label className="text-sm font-medium text-slate-600 dark:text-slate-400">Texto del logo</label><input type="text" value={header.logoText} onChange={(e) => handleHeaderChange('logoText', e.target.value)} className="mt-1 w-full p-2 border rounded-md text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600" /></div>
                            <div><label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1 block">Enlaces</label><div className="space-y-2">{(header.navLinks || []).map(link => (<div key={link.id} className="flex items-center gap-2"><input type="text" placeholder="Texto" value={link.text} onChange={e => handleNavLinkChange(link.id, 'text', e.target.value)} className="w-1/2 p-2 border rounded-md text-sm" /><input type="text" placeholder="URL" value={link.href} onChange={e => handleNavLinkChange(link.id, 'href', e.target.value)} className="w-1/2 p-2 border rounded-md text-sm" /><button onClick={() => deleteNavLink(link.id)} aria-label="Eliminar enlace" className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button></div>))}</div><button onClick={addNavLink} className="mt-2 text-sm flex items-center justify-center gap-2 w-full bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-md dark:bg-slate-700 dark:hover:bg-slate-600"><Plus size={14} /> Añadir enlace</button></div>
                        </div>
                    </div>

                    {/* Editor de Bloques */}
                    {blocks.map((block) => (
                        <div key={block.id} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50 dark:border-slate-700 relative group">
                            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 capitalize">{block.type}</label>
                            
                            {block.type === 'heading' && <input type="text" value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} className="w-full p-2 border rounded-md text-lg font-bold" />}
                            {block.type === 'paragraph' && <textarea value={block.content} onChange={(e) => updateBlock(block.id, e.target.value)} rows={5} className="w-full p-2 border rounded-md text-base" />}
                            {block.type === 'image' && <div className="space-y-3"><label className="text-sm font-medium">URL de la imagen</label><input type="text" value={block.content.src} onChange={(e) => updateBlock(block.id, { ...block.content, src: e.target.value })} className="w-full p-2 border rounded-md" /><label className="text-sm font-medium">Texto alternativo</label><input type="text" value={block.content.alt} onChange={(e) => updateBlock(block.id, { ...block.content, alt: e.target.value })} className="w-full p-2 border rounded-md" /></div>}
                            {block.type === 'hero' && <div className="space-y-4"><div><label className="text-sm font-medium">Título</label><input type="text" value={block.content.heading} onChange={e => updateBlock(block.id, { ...block.content, heading: e.target.value })} className="mt-1 w-full p-2 border rounded-md" /></div><div><label className="text-sm font-medium">Subtítulo</label><input type="text" value={block.content.subheading} onChange={e => updateBlock(block.id, { ...block.content, subheading: e.target.value })} className="mt-1 w-full p-2 border rounded-md" /></div><div><label className="text-sm font-medium">URL de Imagen de Fondo</label><input type="text" value={block.content.image} onChange={e => updateBlock(block.id, { ...block.content, image: e.target.value })} className="mt-1 w-full p-2 border rounded-md" /></div><div><label className="text-sm font-medium">Alineación de texto</label><div className="flex space-x-2 mt-1"><button onClick={() => updateBlock(block.id, { ...block.content, styles: { ...block.content.styles, textAlignment: 'left' } })} className={`text-sm p-2 rounded-md ${block.content.styles.textAlignment === 'left' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>Izquierda</button><button onClick={() => updateBlock(block.id, { ...block.content, styles: { ...block.content.styles, textAlignment: 'center' } })} className={`text-sm p-2 rounded-md ${block.content.styles.textAlignment === 'center' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>Centro</button><button onClick={() => updateBlock(block.id, { ...block.content, styles: { ...block.content.styles, textAlignment: 'right' } })} className={`text-sm p-2 rounded-md ${block.content.styles.textAlignment === 'right' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>Derecha</button></div></div><div><label className="text-sm font-medium">Alineación vertical</label><div className="flex space-x-2 mt-1"><button onClick={() => updateBlock(block.id, { ...block.content, styles: { ...block.content.styles, verticalAlignment: 'start' } })} className={`text-sm p-2 rounded-md ${block.content.styles.verticalAlignment === 'start' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>Arriba</button><button onClick={() => updateBlock(block.id, { ...block.content, styles: { ...block.content.styles, verticalAlignment: 'center' } })} className={`text-sm p-2 rounded-md ${block.content.styles.verticalAlignment === 'center' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>Medio</button><button onClick={() => updateBlock(block.id, { ...block.content, styles: { ...block.content.styles, verticalAlignment: 'end' } })} className={`text-sm p-2 rounded-md ${block.content.styles.verticalAlignment === 'end' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>Abajo</button></div></div></div>}
                            
                            {block.type === 'features' && (
                                <div className="space-y-4">
                                    <div><label className="text-sm font-medium">Título Principal</label><input type="text" value={block.content.heading} onChange={e => updateBlock(block.id, { ...block.content, heading: e.target.value })} className="mt-1 w-full p-2 border rounded-md" /></div>
                                    <div><label className="text-sm font-medium">Subtítulo</label><input type="text" value={block.content.subheading} onChange={e => updateBlock(block.id, { ...block.content, subheading: e.target.value })} className="mt-1 w-full p-2 border rounded-md" /></div>
                                    <div className="space-y-3 pt-2">
                                        <label className="text-sm font-medium">Lista de Características</label>
                                        {block.content.features.map((feature, index) => (
                                            <div key={feature.id} className="p-3 border rounded bg-white dark:bg-slate-800/50 space-y-2">
                                                <div className="flex items-center justify-between"><label className="text-xs font-bold text-slate-500">Característica #{index + 1}</label><button onClick={() => { const newFeatures = block.content.features.filter(f => f.id !== feature.id); updateBlock(block.id, { ...block.content, features: newFeatures }); }} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button></div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input type="text" placeholder="Icono (ej. Rocket)" value={feature.icon} onChange={e => { const newFeatures = [...block.content.features]; newFeatures[index].icon = e.target.value; updateBlock(block.id, { ...block.content, features: newFeatures }); }} className="p-2 border rounded-md text-sm" />
                                                    <input type="text" placeholder="Título" value={feature.title} onChange={e => { const newFeatures = [...block.content.features]; newFeatures[index].title = e.target.value; updateBlock(block.id, { ...block.content, features: newFeatures }); }} className="p-2 border rounded-md text-sm" />
                                                </div>
                                                <textarea placeholder="Descripción" value={feature.description} rows={3} onChange={e => { const newFeatures = [...block.content.features]; newFeatures[index].description = e.target.value; updateBlock(block.id, { ...block.content, features: newFeatures }); }} className="w-full p-2 border rounded-md text-sm" />
                                            </div>
                                        ))}
                                        <button onClick={() => { const newFeatures = [...block.content.features, { id: crypto.randomUUID(), icon: 'Check', title: 'Nueva Característica', description: 'Describe este punto clave.' }]; updateBlock(block.id, { ...block.content, features: newFeatures }); }} className="mt-2 text-sm flex items-center justify-center gap-2 w-full bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-md dark:bg-slate-700 dark:hover:bg-slate-600"><Plus size={14} /> Añadir Característica</button>
                                    </div>
                                </div>
                            )}

                            {block.type === 'cta' && (
                                <div className="space-y-4">
                                    <div><label className="text-sm font-medium">Título</label><input type="text" value={block.content.heading} onChange={e => updateBlock(block.id, { ...block.content, heading: e.target.value })} className="mt-1 w-full p-2 border rounded-md" /></div>
                                    <div><label className="text-sm font-medium">Subtítulo</label><textarea value={block.content.subheading} onChange={e => updateBlock(block.id, { ...block.content, subheading: e.target.value })} rows={3} className="mt-1 w-full p-2 border rounded-md" /></div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><label className="text-sm font-medium">Texto del Botón</label><input type="text" value={block.content.buttonText} onChange={e => updateBlock(block.id, { ...block.content, buttonText: e.target.value })} className="mt-1 w-full p-2 border rounded-md" /></div>
                                        <div><label className="text-sm font-medium">Enlace del Botón</label><input type="text" value={block.content.buttonHref} onChange={e => updateBlock(block.id, { ...block.content, buttonHref: e.target.value })} className="mt-1 w-full p-2 border rounded-md" /></div>
                                    </div>
                                </div>
                            )}

                            <button onClick={() => deleteBlock(block.id)} aria-label="Eliminar bloque" className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-3 flex-shrink-0">
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => addBlock('heading')} className="text-sm flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-md dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"><Plus size={14} /> Título</button>
                        <button onClick={() => addBlock('paragraph')} className="text-sm flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-md dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"><Plus size={14} /> Párrafo</button>
                        <button onClick={() => addBlock('image')} className="text-sm flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-md dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"><Plus size={14} /> Imagen</button>
                        <button onClick={() => addBlock('hero')} className="text-sm flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-md dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"><Plus size={14} /> Hero</button>
                        <button onClick={() => addBlock('features')} className="text-sm flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-md dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"><Plus size={14} /> Features</button>
                        <button onClick={() => addBlock('cta')} className="text-sm flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-md dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-colors"><Plus size={14} /> CTA</button>
                    </div>
                    <div className="flex gap-2 flex-col md:flex-row">
                        <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-400 transition-colors font-semibold">{isSaving ? 'Guardando...' : 'Guardar Cambios'}</button>
                        <button 
                            onClick={() => setIsEditing(false)} 
                            className="flex items-center justify-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 md:hidden"
                        >
                            <Eye size={16} /> Previsualizar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Panel de Previsualización con lógica para móviles corregida */}
            <main className={`w-full md:flex-1 md:h-full ${!isEditing ? 'block' : 'hidden md:block'}`}>
                <div className="h-screen overflow-y-auto p-4 md:p-10">
                    <div className="w-full h-full bg-white rounded-lg shadow-xl">
                        <MinimaTemplate header={header} blocks={blocks} />
                    </div>
                </div>
            </main>
            
            {/* Botón flotante "Editar" para móviles */}
            {!isEditing && (
                <div className="md:hidden fixed bottom-5 right-5 z-50">
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                    >
                        <Edit size={18} />
                        <span>Editar</span>
                    </button>
                </div>
            )}
        </div>
    );
}