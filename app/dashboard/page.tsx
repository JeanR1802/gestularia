import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/ui/SignOutButton';
import Link from 'next/link';
import ThemeToggleClient from '@/components/ui/ThemeToggleClient';
import { ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  // --- CAMBIO 1: Reemplazamos getSession() por getUser() ---
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- CAMBIO 2: Verificamos 'user' en lugar de 'session' ---
  if (!user) {
    redirect('/login');
  }

  // --- CAMBIO 3: Usamos user.id en la consulta ---
  const { data: sites } = await supabase
    .from('sites')
    .select('id, name')
    .eq('user_id', user.id);

  const rootDomain = process.env.NODE_ENV === 'production' ? 'gestularia.com' : 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#111] dark:to-[#1a1a1a] text-gray-800 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-[#1b1b1b] shadow-sm dark:shadow-md border-b border-gray-200 dark:border-gray-700">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
              Gestularia
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {/* --- CAMBIO 4: Mostramos user.email --- */}
                {user.email}
              </span>
              <ThemeToggleClient />
              <SignOutButton />
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
              Bienvenido a tu Dashboard
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Aquí podrás crear y gestionar tus sitios web de manera profesional.
            </p>
          </div>

          {/* Crear nuevo sitio */}
          <div className="bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md dark:shadow-lg p-8 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Crea un nuevo sitio</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Elige una plantilla profesional como punto de partida para tu nuevo proyecto.</p>
            <div className="mt-6">
              <Link
                href="/new-site"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
              >
                Elegir una Plantilla
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Lista de sitios */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tus Sitios</h3>
            {sites && sites.length > 0 ? (
              <div className="bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md dark:shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
                {sites.map((site) => {
                  const siteUrl = `${protocol}://${site.name}.${rootDomain}`;
                  return (
                    <div key={site.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
                      <div className="mb-4 sm:mb-0">
                        <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{site.name}.{rootDomain}</p>
                      </div>
                      <div className="flex space-x-3">
                        <Link href={siteUrl} target="_blank" className="px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-all duration-200">
                          Visitar
                        </Link>
                        <Link href={`/editor/${site.id}`} className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200">
                          Editar
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center shadow-md dark:shadow-lg">
                <p className="text-gray-600 dark:text-gray-400 text-lg">Aún no has creado ningún sitio. ¡Crea el primero!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}