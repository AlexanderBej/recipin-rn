import { addDays, formatISO } from "date-fns";
import { createSelector } from "@reduxjs/toolkit";

import { selectPlannerByDate } from "./planner.selectors";
import { MealSlot, PlanItem, RootState } from "@/api";
import { MEAL_SLOTS } from "@/constants/planner.const";

// 'YYYY-MM-DD' -> { breakfast?: boolean; lunch?: boolean; ... }
export type WeekGrid = Record<
  string,
  Partial<Record<MealSlot, PlanItem | undefined>>
>;

export const makeSelectWeekGrid = () =>
  createSelector(
    [
      selectPlannerByDate,
      (_: RootState, weekStart: string) => weekStart, // 'YYYY-MM-DD'
    ],
    (byDate, weekStart) => {
      const grid: WeekGrid = {};
      const recipeIds: string[] = [];

      const startDate = new Date(weekStart);

      // 1) initialize empty 7-day × meal grid
      for (let i = 0; i < 7; i++) {
        const date = formatISO(addDays(startDate, i), {
          representation: "date",
        });
        grid[date] = {};
        for (const meal of MEAL_SLOTS) {
          grid[date][meal] = undefined;
        }
      }

      // 2) fill grid + collect recipeIds
      for (const date in byDate) {
        if (!Object.prototype.hasOwnProperty.call(byDate, date)) continue;
        if (!grid[date]) continue;

        const itemsForDay = byDate[date];
        for (const item of itemsForDay) {
          grid[date][item.meal] = item;

          if (item.recipeId) {
            recipeIds.push(item.recipeId);
          }
        }
      }

      return {
        grid,
        recipeIds: Array.from(new Set(recipeIds)), // optional dedupe
      };
    }
  );
