import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Redirect legacy /coo-work/[id] to new /work-item/[id]
export default async function COOWorkDetailPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/work-item/${id}`);
}
