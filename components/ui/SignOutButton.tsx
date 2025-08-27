// FILE: /components/SignOutButton.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirige a la página de inicio
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
    >
      Cerrar Sesión
    </button>
  );
}
