// FILE: /app/admin/page.tsx

import type { Metadata } from 'next';
import AdminDashboard from './dashboard';
import { rootDomain } from '@/lib/utils';

export const metadata: Metadata = {
  title: `Admin Dashboard | ${rootDomain}`,
  description: `Manage sites for ${rootDomain}`
};

export default async function AdminPage() {
  // Ya no necesitamos obtener los 'tenants' aquí,
  // el componente AdminDashboard ahora lo hace internamente.

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Simplemente renderizamos el componente sin pasarle ninguna propiedad */}
      <AdminDashboard />
    </div>
  );
}
