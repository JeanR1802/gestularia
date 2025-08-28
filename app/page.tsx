"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function HomePage() {
  const plans = [
    {
      name: "Básico",
      price: "$199 MXN",
      description: "Ideal para proyectos pequeños o personales.",
      features: [
        "Hosting incluido",
        "1 página web",
        "Soporte básico",
      ],
      highlight: false,
    },
    {
      name: "Profesional",
      price: "$499 MXN",
      description: "Perfecto para negocios en crecimiento.",
      features: [
        "Hosting rápido",
        "Hasta 5 páginas web",
        "Soporte prioritario",
        "Optimización SEO",
      ],
      highlight: true,
    },
    {
      name: "Premium",
      price: "$899 MXN",
      description: "La mejor opción para marcas establecidas.",
      features: [
        "Hosting premium",
        "Páginas ilimitadas",
        "Soporte 24/7",
        "Integración con IA",
        "Análisis avanzado",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-[#0a0a0a]/70 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Gestularia
          </h1>
          <nav className="hidden md:flex gap-6 text-gray-300 font-medium">
            <a href="#features" className="hover:text-cyan-400 transition">
              Características
            </a>
            <a href="#pricing" className="hover:text-cyan-400 transition">
              Precios
            </a>
            <a href="#testimonials" className="hover:text-cyan-400 transition">
              Opiniones
            </a>
          </nav>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2 rounded-md bg-cyan-500 text-black font-semibold hover:bg-cyan-600 transition"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full overflow-hidden pt-40 pb-32">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a] to-[#111] opacity-90" />
        <div className="absolute inset-0 z-10 opacity-20" style={{
          backgroundImage: "radial-gradient(ellipse at top, #06b6d4, transparent), radial-gradient(ellipse at bottom, #2563eb, transparent)"
        }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 max-w-7xl mx-auto px-6 text-center"
        >
          <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Crea tu Sitio Web{" "}
            <span className="text-white">en Minutos</span>
          </h2>
          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-gray-400">
            Plataforma no-code para emprendedores, freelancers y negocios. Fácil,
            rápido y con diseño profesional desde el primer clic.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              href="/login"
              className="rounded-lg bg-cyan-500 text-black px-8 py-4 font-semibold shadow-lg hover:bg-cyan-600 transition"
            >
              Empieza Gratis
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-gray-700 text-white px-8 py-4 font-semibold hover:bg-gray-800 transition"
            >
              Ver Más
            </a>
          </div>
          {/* Imagen Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16"
          >
            <div className="mx-auto w-full max-w-5xl h-80 bg-gray-800/50 rounded-2xl flex items-center justify-center text-gray-400 text-2xl font-bold shadow-lg border border-gray-700">
              Demo de la plataforma
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Características que te Encantarán
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Diseñada para que tu web sea rápida, personalizable y siempre
            profesional.
          </p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "⚡",
                title: "Rápido",
                desc: "Lanza tu sitio en minutos, sin complicaciones.",
              },
              {
                icon: "🎨",
                title: "Flexible",
                desc: "Personaliza colores, secciones y estilos fácilmente.",
              },
              {
                icon: "🛠️",
                title: "No-Code",
                desc: "Construye con un editor visual sin tocar código.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 shadow-md hover:shadow-cyan-500/10 hover:-translate-y-1 transition transform"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-2xl mb-3">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="w-full py-20 bg-gradient-to-b from-[#0a0a0a] to-[#111] text-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
          >
            Planes de precios
          </motion.h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
            Elige el plan que mejor se adapte a tu negocio y comienza a crecer con una web profesional.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  className={`relative overflow-hidden rounded-2xl border ${
                    plan.highlight
                      ? "border-cyan-500 shadow-lg shadow-cyan-500/30"
                      : "border-gray-800"
                  } bg-[#1a1a1a] hover:scale-105 transition-transform`}
                >
                  {plan.highlight && (
                    <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500 text-black">
                      Más popular
                    </span>
                  )}
                  <CardContent className="p-8 flex flex-col items-center">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-3xl font-extrabold text-cyan-400 mb-3">
                      {plan.price}
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      {plan.description}
                    </p>
                    <ul className="space-y-3 text-left w-full">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center text-gray-300 text-sm"
                        >
                          <CheckCircle className="w-5 h-5 text-cyan-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`mt-8 w-full rounded-xl text-white font-semibold py-2 px-4 transition-colors duration-300 ${
                        plan.highlight
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      Elegir plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-[#111]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                text: "Gestularia me permitió lanzar mi web en un día. ¡Impresionante!",
                author: "– Juan P.",
              },
              {
                text: "La mejor herramienta no-code que probé. Intuitiva y potente.",
                author: "– Laura M.",
              },
              {
                text: "Ahora actualizo mi web sin depender de un desarrollador.",
                author: "– Carlos R.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 shadow hover:shadow-cyan-500/10 transition"
              >
                <p className="text-gray-400 italic mb-4">“{t.text}”</p>
                <span className="font-semibold text-white">{t.author}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <h3 className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Gestularia
          </h3>
          <nav className="flex gap-6 mt-6 md:mt-0 text-gray-500">
            <a href="#" className="hover:text-white">
              Contacto
            </a>
            <a href="#" className="hover:text-white">
              Privacidad
            </a>
            <a href="#" className="hover:text-white">
              Términos
            </a>
          </nav>
          <p className="text-gray-600 text-sm mt-6 md:mt-0">
            &copy; 2025 Gestularia. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}