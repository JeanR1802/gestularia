'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('sign-in'); // 'sign-in' o 'sign-up'
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      setView('check-email');
    } catch (err: any) {
      alert('Error al registrar el usuario: ' + err.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Redirige al dashboard solo UNA vez
      router.push('/dashboard');
    } catch (err: any) {
      alert('Error al iniciar sesión: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {view === 'check-email' ? (
          <p className="text-center text-gray-700">
            Revisa tu correo electrónico (<span className="font-bold">{email}</span>) para confirmar tu registro.
          </p>
        ) : (
          <>
            <div className="flex justify-center border-b">
              <button onClick={() => setView('sign-in')} className={`px-4 py-2 text-sm font-medium border-b-2 ${view === 'sign-in' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
                Iniciar Sesión
              </button>
              <button onClick={() => setView('sign-up')} className={`px-4 py-2 text-sm font-medium border-b-2 ${view === 'sign-up' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
                Registrarse
              </button>
            </div>

            <form className="pt-4 space-y-6" onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input id="email" type="email" required placeholder="tu@email.com"
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input id="password" type="password" required minLength={6} placeholder="••••••••"
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {view === 'sign-in' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
