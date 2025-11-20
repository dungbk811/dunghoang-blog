import { redirect } from 'next/navigation';

// Redirect legacy /coo-work to /coo page
export default function COOWorkPage() {
  redirect('/coo');
}
