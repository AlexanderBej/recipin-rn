import { RatingCategory } from "@/api/types/index";
import { RATING_CATEGORIES } from "@/constants/recipes.const";

export function getRatingAverage(categories?: Partial<Record<RatingCategory, number>>): number {
  if (!categories) return 0;

  let total = 0;
  let count = 0;

  for (const cat of RATING_CATEGORIES) {
    const val = categories[cat] ?? 0;
    if (val > 0) {
      total += val;
      count++;
    }
  }

  return count === 0 ? 0 : total / count;
}
