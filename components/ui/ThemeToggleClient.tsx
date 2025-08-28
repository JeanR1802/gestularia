// FILE: components/ui/ThemeToggleClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

/**
 * Componente de alternancia de tema del lado del cliente.
 * Usa el hook useTheme de 'next-themes' para gestionar el estado del tema.
 *
 * @returns {JSX.Element | null} Un botón para alternar el tema o null si el componente no ha sido montado.
 */
const ThemeToggleClient = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect se asegura de que el componente solo se renderice en el cliente
  // y previene un error de "mismatch" con el HTML del servidor.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors"
      aria-label="Alternar modo oscuro/claro"
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};

export default ThemeToggleClient;
