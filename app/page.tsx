// FILE: /app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-5xl font-bold sm:text-6xl">Crea tu Propio Sitio Web en Minutos</h1>
          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto">
            Plataforma profesional para lanzar tu web sin escribir código. Rápido, fácil y personalizable.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              href="/login"
              className="rounded-md bg-white text-blue-600 px-6 py-3 font-semibold shadow hover:bg-gray-100 transition"
            >
              Empezar Ahora
            </Link>
            <a
              href="#features"
              className="text-white px-6 py-3 font-semibold hover:underline"
            >
              Ver Características
            </a>
          </div>
          {/* Placeholder imagen */}
          <div className="mt-12">
            <div className="mx-auto w-full max-w-4xl h-64 bg-white/20 rounded-lg flex items-center justify-center text-white text-xl font-bold">
              Imagen de la plataforma
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Características Principales</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas para construir y gestionar tu sitio web de manera profesional.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold text-xl mb-2">Rápido</h3>
              <p className="text-gray-600">Crea tu web en minutos sin complicaciones técnicas.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-semibold text-xl mb-2">Flexible</h3>
              <p className="text-gray-600">Personaliza colores, textos y secciones fácilmente.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="font-semibold text-xl mb-2">Sin Código</h3>
              <p className="text-gray-600">Todo se maneja con herramientas visuales intuitivas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Lo que dicen nuestros usuarios</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">
                "Gestularia me permitió lanzar mi web profesional en menos de un día. ¡Impresionante!"
              </p>
              <span className="font-semibold">– Juan P.</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">
                "La mejor herramienta no-code que he probado, todo es intuitivo y rápido."
              </p>
              <span className="font-semibold">– Laura M.</span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-4">
                "Ahora puedo crear y actualizar sitios web sin depender de un desarrollador."
              </p>
              <span className="font-semibold">– Carlos R.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="font-bold text-xl mb-4">Gestularia</h3>
          <p className="text-gray-400 mb-4">Crea tu sitio web profesional sin escribir código.</p>
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="hover:underline">Contacto</a>
            <a href="#" className="hover:underline">Política de Privacidad</a>
            <a href="#" className="hover:underline">Términos de Servicio</a>
          </div>
          <p className="text-gray-500 text-sm">&copy; 2025 Gestularia. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
