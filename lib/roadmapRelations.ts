import { learningRoadmap, cooRoadmap } from './roadmap';

// Get related categories between Learning and COO Work
export function getRelatedCategories(
  currentCategory: string,
  type: 'learning' | 'coo'
): { category: string; count: number }[] {
  if (currentCategory === 'All') return [];

  const sourceItems = type === 'learning' ? learningRoadmap : cooRoadmap;
  const targetItems = type === 'learning' ? cooRoadmap : learningRoadmap;
  const relationKey = type === 'learning' ? 'relatedWorkIds' : 'relatedLearningIds';

  // Get all IDs of items in current category
  const currentCategoryItemIds = sourceItems
    .filter((item) => item.category === currentCategory)
    .map((item) => item.id);

  // Find all related target items
  const relatedTargetIds = new Set<string>();

  // From source to target
  sourceItems
    .filter((item) => item.category === currentCategory && item[relationKey])
    .forEach((item) => {
      item[relationKey]?.forEach((id) => relatedTargetIds.add(id));
    });

  // From target to source
  targetItems
    .filter((item) => item[relationKey])
    .forEach((item) => {
      const hasRelation = item[relationKey]?.some((id) =>
        currentCategoryItemIds.includes(id)
      );
      if (hasRelation) {
        relatedTargetIds.add(item.id);
      }
    });

  // Group by category and count
  const categoryCount: Record<string, number> = {};
  targetItems
    .filter((item) => relatedTargetIds.has(item.id))
    .forEach((item) => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

  return Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
