// FILE: /app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="text-center max-w-2xl mx-auto p-8">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Crea tu Propio Sitio Web en Minutos
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Nuestra plataforma te da las herramientas para lanzar una web profesional sin necesidad de escribir una sola línea de código. Rápido, fácil y personalizable.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Empezar Ahoraaaaaa
          </Link>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Ver Características <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
