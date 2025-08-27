// FILE: /app/admin/dashboard.tsx

import { Suspense } from 'react';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Nueva función para obtener todos los sitios de la base de datos
async function getAllSites() {
  const supabase = createServerComponentClient({ cookies });
  // Hacemos una consulta a nuestra tabla 'sites' y la unimos con 'users' para obtener el email
  const { data, error } = await supabase
    .from('sites')
    .select(`
      id,
      name,
      created_at,
      users ( email )
    `);

  if (error) {
    console.error('Error fetching sites for admin:', error);
    return [];
  }

  // Aplanamos los datos para que sean más fáciles de usar
  return data.map(site => ({
    ...site,
    // @ts-ignore - Supabase types can be tricky with joins
    owner_email: site.users?.email || 'N/A'
  }));
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Volver a la página principal
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Todos los Sitios Registrados
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Esta es una lista de todos los sitios creados por los usuarios en la tabla 'sites'.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <Suspense fallback={<p className="p-6 text-center text-gray-500">Cargando sitios...</p>}>
              <SitesList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente que obtiene y muestra la lista de sitios en una tabla simple
async function SitesList() {
  const sites = await getAllSites();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subdominio
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Propietario (Email)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Creación
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sites.map((site) => (
            <tr key={site.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {site.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {site.owner_email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(site.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {sites.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                No se encontraron sitios.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
