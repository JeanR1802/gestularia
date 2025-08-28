'use client'; 

import { memo } from 'react';
import Link from 'next/link';
import { Rocket, ShieldCheck, Smartphone, Check, type LucideIcon } from 'lucide-react';

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

// Objeto para usar iconos de forma dinámica
const icons: { [key: string]: LucideIcon } = {
    Rocket,
    ShieldCheck,
    Smartphone,
    Check,
};

// Componente para renderizar un bloque individual
const BlockRenderer = memo(function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading': return <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">{block.content}</h1>;
    case 'paragraph': return <p className="mt-4 text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">{block.content}</p>;
    case 'image': return <img src={block.content.src} alt={block.content.alt} className="w-full h-auto rounded-xl shadow-lg mt-8" />;
    case 'hero': {
      const { heading, subheading, image, styles } = block.content;
      const vAlign = { start: 'justify-start', center: 'justify-center', end: 'justify-end' };
      const textAlign = { left: 'text-left', center: 'text-center', right: 'text-right' };
      return (
        <div className={`relative w-full h-[60vh] max-h-[600px] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${vAlign[styles.verticalAlignment]} p-8 md:p-12 text-white`}>
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out hover:scale-105" style={{ backgroundImage: `url(${image})` }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className={`relative z-10 w-full max-w-4xl mx-auto ${textAlign[styles.textAlignment]}`}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter drop-shadow-md">{heading}</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-sm">{subheading}</p>
          </div>
        </div>
      );
    }
    case 'features': {
        const { heading, subheading, features } = block.content;
        return (
          <div className="py-16 bg-white rounded-2xl"> 
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{heading}</h2>
              <p className="mt-4 text-lg text-slate-600">{subheading}</p>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                {features.map((feature) => {
                  const Icon = icons[feature.icon] || Check;
                  return (
                    <div key={feature.id} className="p-2">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white mx-auto mb-5 shadow-lg">
                        <Icon size={24} />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800">{feature.title}</h3>
                      <p className="mt-2 text-base text-slate-500">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
    }
    case 'cta': {
        const { heading, subheading, buttonText, buttonHref } = block.content;
        return (
            <div className="bg-blue-600 rounded-2xl shadow-xl">
                <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
                        {heading}
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-blue-100">
                        {subheading}
                    </p>
                    <Link
                        href={buttonHref}
                        className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-semibold text-blue-600 bg-white hover:bg-blue-50 sm:w-auto transition-transform transform hover:scale-105"
                    >
                        {buttonText}
                    </Link>
                </div>
            </div>
        );
    }
    default: return null;
  }
});

// Componente para el Header
const Header = memo(function Header({ content }: { content: HeaderContent }) {
    return (
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors">
              <Link href="#">{content.logoText || 'Mi Sitio'}</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {(content.navLinks || []).map(link => (
              <Link key={link.id} href={link.href} className="text-sm font-medium text-slate-600 hover:text-blue-600">
                  {link.text}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    );
});
  
// Componente principal que une todo
export function MinimaTemplate({ header, blocks }: { header: HeaderContent, blocks: Block[] }) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <Header content={header} />
        <main className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-10 md:space-y-12">
            {blocks.map(block => <BlockRenderer key={block.id} block={block} />)}
          </div>
        </main>
        <footer className="bg-white border-t border-slate-200 mt-16">
          <div className="container mx-auto px-6 py-8 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {header.logoText}. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    );
}