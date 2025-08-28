// FILE: app/new-site/[templateId]/_components/CreateSiteForm.tsx
'use client';

import { useEffect } from 'react'; // <-- 1. Importamos useEffect
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createSiteFromTemplate } from '@/app/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
    >
      {pending ? 'Creando sitio...' : 'Crear Sitio Web'}
    </button>
  );
}

export function CreateSiteForm({ templateId }: { templateId: string }) {
  const initialState = { message: '', success: false };
  const [state, formAction] = useActionState(createSiteFromTemplate, initialState);

  // 2. Añadimos un useEffect para manejar la redirección
  useEffect(() => {
    // Si la acción del servidor devolvió 'success: true'
    if (state.success) {
      // Redirigimos al usuario desde el navegador.
      // Esto fuerza una recarga completa y evita problemas de caché.
      window.location.href = '/dashboard';
    }
  }, [state.success]); // Este efecto se ejecuta solo cuando 'state.success' cambia

  return (
    <form action={formAction} className="space-y-4">
      {/* ... (el resto del formulario se mantiene exactamente igual) ... */}
      <div>
        <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre del Subdominio
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            name="subdomain"
            id="subdomain"
            className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="mi-increible-sitio"
            required
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
            .gestularia.com
          </span>
        </div>
      </div>
      
      <input type="hidden" name="templateId" value={templateId} />
      
      <SubmitButton />
      
      {/* Mostramos el mensaje de error si no hubo éxito */}
      {!state.success && state.message && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}
    </form>
  );
}