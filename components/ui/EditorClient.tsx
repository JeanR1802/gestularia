// FILE: /components/EditorClient.tsx
'use client';

import { useState } from 'react';
import { updateSiteContent } from '@/app/actions';
import Link from 'next/link'; // Importamos Link para la navegación
import { ArrowLeft } from 'lucide-react'; // Un icono para el botón de regreso

type PageData = {
  title: string;
  description: string;
};

type EditorClientProps = {
  site: { id: string; name: string };
  initialContent: PageData;
};

export default function EditorClient({ site, initialContent }: EditorClientProps) {
  // El estado ahora es un objeto, no un string de JSON
  const [pageData, setPageData] = useState<PageData>(initialContent);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Un solo manejador para actualizar cualquier campo del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('Guardando...');
    // Convertimos el objeto de estado a JSON antes de enviarlo
    const result = await updateSiteContent(site.id, JSON.stringify(pageData));
    setMessage(result.message);
    setIsSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral de herramientas (Panel de Edición) */}
      <aside className="w-1/3 bg-white p-6 border-r flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Editor Visual</h2>
          <Link href="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-gray-800">
            <ArrowLeft size={16} className="mr-1" />
            Regresar al Dashboard
          </Link>
        </div>
        
        <div className="space-y-6 flex-grow">
          {/* Campo para el Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título Principal
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={pageData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md shadow-sm"
              placeholder="El título de tu página"
            />
          </div>

          {/* Campo para la Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={pageData.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full p-2 border rounded-md shadow-sm"
              placeholder="Describe tu sitio o producto"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {message && <p className="mt-2 text-sm text-center">{message}</p>}
        </div>
      </aside>

      {/* Previsualización en vivo */}
      <main className="w-2/3 p-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-600">Previsualización en Vivo</h3>
        <div className="bg-white p-12 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800">{pageData.title}</h1>
          <p className="mt-4 text-gray-600">{pageData.description}</p>
        </div>
      </main>
    </div>
  );
}
