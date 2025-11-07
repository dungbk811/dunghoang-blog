'use client';

import { RoadmapItem } from '@/lib/roadmap';
import CompactCard from './CompactCard';

interface KanbanViewProps {
  items: { item: RoadmapItem; postCount: number }[];
  type: 'learning' | 'coo';
}

export default function KanbanView({ items, type }: KanbanViewProps) {
  const plannedItems = items.filter(({ item }) => item.status === 'planned');
  const inProgressItems = items.filter(({ item }) => item.status === 'in-progress');
  const completedItems = items.filter(({ item }) => item.status === 'completed');

  const columns = [
    {
      status: 'planned',
      title: '🔵 Sắp làm',
      items: plannedItems,
      borderColor: 'border-blue-200 dark:border-blue-800/50',
      bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
    },
    {
      status: 'in-progress',
      title: '🟡 Đang làm',
      items: inProgressItems,
      borderColor: 'border-amber-200 dark:border-amber-800/50',
      bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
    },
    {
      status: 'completed',
      title: '🟢 Đã xong',
      items: completedItems,
      borderColor: 'border-green-200 dark:border-green-800/50',
      bgColor: 'bg-green-50/50 dark:bg-green-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.status} className="space-y-4">
          {/* Column Header */}
          <div className={`rounded-lg border ${column.borderColor} ${column.bgColor} p-4`}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {column.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {column.items.length} items
            </p>
          </div>

          {/* Column Items */}
          <div className="space-y-3">
            {column.items.length > 0 ? (
              column.items.map(({ item, postCount }) => (
                <CompactCard
                  key={item.id}
                  item={item}
                  postCount={postCount}
                  type={type}
                />
              ))
            ) : (
              <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-500">
                Không có items
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
