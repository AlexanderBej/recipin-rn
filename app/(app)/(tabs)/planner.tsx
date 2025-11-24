import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { parseISO, isToday, isYesterday, isTomorrow, format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { AppDispatch, RootState } from "@/api/types";
import {
  initializePlanner,
  makeSelectWeekGrid,
  selectPlannerWeekStart,
  setAnchorWeekStart,
} from "@/store/planner-store";
import { selectAuthUserId } from "@/store/auth-store";
import { getWeekDays, getWeekStart } from "@/utils";
import { theme } from "@/constants/theme/index";

import { Button } from "@/components/ui/button";
import { MEAL_SLOTS } from "@/constants/planner.const";
import { PeriodSwitcher, WeekTable, PlanItemBox } from "@/features";
import { getRecipesByIds, GroceryItem } from "@/api";
import { addGroceryRecipe } from "@/store";

export default function PlannerScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const uid = useSelector(selectAuthUserId);
  const anchorWeekStartISO = useSelector(selectPlannerWeekStart);

  const anchorWeekStart = useMemo(
    () =>
      anchorWeekStartISO
        ? new Date(anchorWeekStartISO)
        : getWeekStart(new Date(), 1),
    [anchorWeekStartISO]
  );

  // ensure anchor week is stored
  useEffect(() => {
    if (!anchorWeekStartISO) {
      dispatch(setAnchorWeekStart(anchorWeekStart.toISOString()));
    }
  }, [anchorWeekStartISO, anchorWeekStart, dispatch]);

  // load planner data
  useEffect(() => {
    if (!uid) return;
    dispatch(initializePlanner(uid));
  }, [uid, dispatch]);

  // -1 = last week, 0 = current, 1 = next
  const [weekOffset, setWeekOffset] = useState<-1 | 0 | 1>(0);

  const visibleWeekStart = useMemo(() => {
    const d = new Date(anchorWeekStart);
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [anchorWeekStart, weekOffset]);

  const days = useMemo(() => getWeekDays(visibleWeekStart), [visibleWeekStart]);

  const selectWeekGrid = useMemo(makeSelectWeekGrid, []);
  const { grid, recipeIds } = useSelector((state: RootState) =>
    selectWeekGrid(state, format(visibleWeekStart, "yyyy-MM-dd"))
  );

  const [selectedDateISO, setSelectedDateISO] = useState<string>(() =>
    format(new Date(), "yyyy-MM-dd")
  );

  // keep selectedDate in the visible week
  useEffect(() => {
    if (days.length === 0) return;

    const inThisWeek = days.some(
      (d) => format(d, "yyyy-MM-dd") === selectedDateISO
    );
    if (!inThisWeek) {
      setSelectedDateISO(format(days[0], "yyyy-MM-dd"));
    }
  }, [days, selectedDateISO]);

  const formatSelectedDay = (dateISO: string) => {
    const date = parseISO(dateISO);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, dd MMM");
  };

  const handleGenerateGroceryList = async () => {
    // setLoading(true);

    const recipes = await getRecipesByIds(recipeIds);

    recipes.forEach((recipe) => {
      const groceryItems: GroceryItem[] = recipe.ingredients.map((ingr) => ({
        id: uuidv4(),
        name: ingr.item,
        quantity: ingr.quantity,
        unit: ingr.unit,
        checked: false,
        sourceRecipeId: [recipe.id],
      }));
      dispatch(
        addGroceryRecipe({
          items: groceryItems,
          recipeId: recipe.id,
          title: recipe.title,
        })
      );
    });

    // setLoading(false);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PeriodSwitcher
        anchorWeekStart={anchorWeekStart}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
      />

      <View style={styles.tableWrapper}>
        <WeekTable
          visibleStart={visibleWeekStart}
          grid={grid}
          selectedDate={selectedDateISO}
          setSelectedDate={setSelectedDateISO}
        />
      </View>

      <View style={styles.dayContainer}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayHeaderText}>
            {formatSelectedDay(selectedDateISO)}
          </Text>
        </View>

        <View style={styles.dayContent}>
          {MEAL_SLOTS.map((meal) => {
            return (
              <PlanItemBox
                key={meal}
                meal={meal}
                selectedDateISO={selectedDateISO}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button variant="primary" onPress={handleGenerateGroceryList}>
          Generate grocery list
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: theme.spacing[4],
    paddingBottom: 120,
  },
  tableWrapper: {
    marginTop: theme.spacing[6],
  },
  dayContainer: {
    marginTop: theme.spacing[6],
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  dayHeader: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.bgCard,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.bgCardLight,
  },
  dayHeaderText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  dayContent: {
    marginTop: theme.spacing[4],
    gap: theme.spacing[4],
  },
  footer: {
    marginTop: theme.spacing[6],
    alignItems: "center",
  },
});
