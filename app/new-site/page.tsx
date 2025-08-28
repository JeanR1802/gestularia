// FILE: app/new-site/page.tsx
import { templates } from '@/app/templates'; // <-- CORRECCIÓN: Se añadió 'app/' a la ruta
import Link from 'next/link';

export default function NewSitePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
            Elige tu Plantilla
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Selecciona un diseño profesional como punto de partida para tu nuevo sitio.
          </p>
        </div>

        {/* Mapeamos el array de plantillas para mostrarlas como tarjetas */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/new-site/${template.id}`} // <-- El enlace ahora incluye el ID de la plantilla
              className="group block bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>
              </div>
              {/* Vista previa de la plantilla (por ahora es un placeholder) */}
              <div className="bg-gray-100 dark:bg-[#1a1a1a] h-48 flex items-center justify-center">
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  [ Vista Previa ]
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}