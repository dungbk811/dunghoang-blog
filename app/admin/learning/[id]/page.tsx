import { use } from 'react';
import ItemDetailPage from '../../components/ItemDetailPage';

export default function LearningDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ItemDetailPage id={id} type="learning" />;
}
