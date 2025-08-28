'use client';

import { useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createSite } from '@/app/actions';
import { Loader2 } from 'lucide-react';

// El estado que nuestra acción devolverá
type State = {
  success: boolean;
  message?: string;
  subdomain?: string; // Para mantener el valor en caso de error
};

const initialState: State = {
  success: false,
};

export function SubdomainForm() {
  // Usamos useActionState, que está diseñado para trabajar con acciones que aceptan 'prevState'.
  // 'action' es la nueva función que pasamos al <form>, y ya tiene el 'prevState' integrado.
  const [state, action, isPending] = useActionState<State, FormData>(
    createSite,
    initialState
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
            defaultValue={state.subdomain} // Mantenemos el valor si hay un error
            className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
            .gestularia.com
          </span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : 'Crear Tienda'}
      </Button>
      
      {state.message && (
        <p className={`text-sm text-center ${state.success ? 'text-green-600' : 'text-red-500'}`}>
            {state.message}
        </p>
      )}
    </form>
  );
}
