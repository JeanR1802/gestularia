'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Corregimos el import para usar la nueva función 'createSite'
import { createSite } from '@/app/actions';
import { Loader2 } from 'lucide-react';

// Ajustamos el tipo de estado para que coincida con la respuesta de la nueva acción
type State = {
  subdomain?: string;
  success: boolean;
  message?: string; // La acción ahora devuelve 'message' en lugar de 'error'
};

export function SubdomainForm() {
  // Usamos 'createSite' y ajustamos el estado inicial
  const [state, action, isPending] = useActionState<State, FormData>(
    createSite,
    { success: false }
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
          Nombre de tu tienda
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <Input
            name="subdomain"
            id="subdomain"
            placeholder="mitienda"
            defaultValue={state.subdomain}
            className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
            .gestularia.com
          </span>
        </div>
      </div>
      
      {/* Eliminamos el campo del ícono, ya que no lo usamos en la nueva lógica */}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : 'Crear Tienda'}
      </Button>
      
      {/* Mostramos el mensaje de éxito o error que viene de 'state.message' */}
      {state.message && (
        <p className={`text-sm text-center ${state.success ? 'text-green-600' : 'text-red-500'}`}>
            {state.message}
        </p>
      )}
    </form>
  );
}
