// FILE: /app/dashboard/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/ui/SignOutButton';
import { SubdomainForm } from '@/components/ui/SubdomainForm';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // MODIFICACIÓN: Ahora seleccionamos el 'id' y el 'name' de cada sitio.
  const { data: sites } = await supabase
    .from('sites')
    .select('id, name') // <-- Añadimos 'id' aquí
    .eq('user_id', session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">Mi Plataforma</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900">
            Bienvenido a tu Dashboard
          </h2>
          <p className="mt-2 text-gray-600">
            Aquí podrás crear y gestionar tus sitios web.
          </p>

          <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Crea un nuevo sitio
            </h3>
            <div className="mt-4">
              <SubdomainForm />
            </div>
          </div>
          
          <div className="mt-8">
             <h3 className="text-lg font-medium leading-6 text-gray-900">
              Tus Sitios
            </h3>
            <div className="mt-4 space-y-4">
              {sites && sites.length > 0 ? (
                sites.map((site) => (
                  <div key={site.id} className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{site.name}.tudominio.com</p>
                    </div>
                    <div className="flex space-x-2">
                       <Link href={`http://${site.name}.localhost:3000`} target="_blank" className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        Visitar
                      </Link>
                      {/* MODIFICACIÓN: El botón 'Editar' ahora es un enlace a la página del editor. */}
                      <Link href={`/editor/${site.id}`} className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200">
                        Editar
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500">
                    Aún no has creado ningún sitio. ¡Crea el primero!
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
