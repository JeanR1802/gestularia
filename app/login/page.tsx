"use client";

import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("sign-in");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) throw error;
      setView("check-email");
    } catch (err: any) {
      alert("Error al registrar el usuario: " + err.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/dashboard");
    } catch (err: any) {
      alert("Error al iniciar sesión: " + err.message);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-gray-100 p-4">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a] to-[#111] opacity-90" />
      <div className="absolute inset-0 z-10 opacity-20" style={{
        backgroundImage: "radial-gradient(ellipse at top, #06b6d4, transparent), radial-gradient(ellipse at bottom, #2563eb, transparent)"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 w-full max-w-md p-8 space-y-6 bg-[#1a1a1a] rounded-2xl shadow-lg border border-gray-800"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
            Gestularia
          </h1>
          <p className="text-gray-400">
            {view === 'sign-in' ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta'}
          </p>
        </div>

        {view === 'check-email' ? (
          <p className="text-center text-gray-300">
            Revisa tu correo electrónico (<span className="font-bold text-cyan-400">{email}</span>) para confirmar tu registro.
          </p>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setView('sign-in')}
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-l-xl transition-colors duration-300 ${
                  view === 'sign-in'
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setView('sign-up')}
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-r-xl transition-colors duration-300 ${
                  view === 'sign-up'
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Registrarse
              </button>
            </div>
            <form className="space-y-6" onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Correo Electrónico</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 text-white font-semibold rounded-md shadow-lg transition-colors duration-300
                  bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {view === 'sign-in' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
              <div className="text-center mt-4">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-cyan-400 transition text-sm"
                >
                  Volver al inicio
                </Link>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}