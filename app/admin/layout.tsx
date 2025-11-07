import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/auth';
import AdminLayout from './AdminLayout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await verifySession();

  if (!isAuthenticated) {
    redirect('/auth/admin-login');
  }

  return <AdminLayout>{children}</AdminLayout>;
}
