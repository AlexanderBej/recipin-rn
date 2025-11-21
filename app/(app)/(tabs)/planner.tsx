// app/(tabs)/planner.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { parseISO, isToday, isYesterday, isTomorrow, format } from "date-fns";
import { useRouter } from "expo-router";

import { AppDispatch, MealSlot, RootState } from "@/api/types";
import {
  addPlanItemThunk,
  initializePlanner,
  makeSelectPlanForDate,
  selectPlannerWeekStart,
  setAnchorWeekStart,
} from "@/store/planner-store";
import { selectAuthUserId } from "@/store/auth-store";
import { PlanItem, RecipeCard } from "@/api/models";
import { getWeekDays, getWeekStart } from "@/utils";
import { theme } from "@/constants/theme/index";

import PeriodSwitcher from "@/components/planner/period-switcher";
import WeekTable from "@/components/planner/week-table";
import SearchSheet from "@/components/sheets/search-sheet";
import RecipeImg from "@/components/ui/recipe-img"; // adjust path to your RN RecipeImg
import { Button } from "@/components/ui/button";
import { fetchRecipeById } from "@/store";
import { MEAL_SLOTS } from "@/constants/planner.const";

export default function PlannerScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const uid = useSelector(selectAuthUserId);
  const anchorWeekStartISO = useSelector(selectPlannerWeekStart);

  const anchorWeekStart = useMemo(
    () => (anchorWeekStartISO ? new Date(anchorWeekStartISO) : getWeekStart(new Date(), 1)),
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

  const [selectedDateISO, setSelectedDateISO] = useState<string>(() =>
    format(new Date(), "yyyy-MM-dd")
  );

  // keep selectedDate in the visible week
  useEffect(() => {
    if (days.length === 0) return;

    const inThisWeek = days.some((d) => format(d, "yyyy-MM-dd") === selectedDateISO);
    if (!inThisWeek) {
      setSelectedDateISO(format(days[0], "yyyy-MM-dd"));
    }
  }, [days, selectedDateISO]);

  const selectPlanForDate = useMemo(makeSelectPlanForDate, []);
  const itemsForSelectedDate = useSelector((state: RootState) =>
    selectPlanForDate(state, selectedDateISO)
  );

  const getItemForSlot = (meal: MealSlot) =>
    itemsForSelectedDate.find((item) => item.meal === meal);

  const formatSelectedDay = (dateISO: string) => {
    const date = parseISO(dateISO);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, dd MMM");
  };

  const handleSearchedRecipe = async (rec: RecipeCard, meal: MealSlot) => {
    if (!uid) return;

    const planItem: Omit<PlanItem, "id"> = {
      date: selectedDateISO,
      meal,
      recipeId: rec.id,
      recipeName: rec.title,
      recipeImgUrl: rec.imageUrl,
      userId: uid,
    };

    await dispatch(addPlanItemThunk({ uid, item: planItem }));
  };

  const handleRecipeTap = (recipeId: string) => {
    dispatch(fetchRecipeById(recipeId) as any); // or typed thunk if you have it
    router.push(`/recipe/${recipeId}`);
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
          anchorWeekStart={anchorWeekStart}
          weekOffset={weekOffset}
          selectedDate={selectedDateISO}
          setSelectedDate={setSelectedDateISO}
        />
      </View>

      <View style={styles.dayContainer}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayHeaderText}>{formatSelectedDay(selectedDateISO)}</Text>
        </View>

        <View style={styles.dayContent}>
          {MEAL_SLOTS.map((meal) => {
            const isSnack = meal === "snacks";
            const planItem = getItemForSlot(meal);

            const showBanner = !isSnack || (isSnack && !!planItem);
            const isRecipe = !!planItem;

            return (
              <View
                key={meal}
                style={[
                  styles.mealBase,
                  showBanner && styles.mealBox,
                  isSnack && !isRecipe && styles.snackBox,
                  isRecipe && styles.recipeBox,
                ]}
              >
                {showBanner && (
                  <Text style={styles.mealType}>
                    {meal}
                  </Text>
                )}

                {isRecipe ? (
                  <View style={styles.recipeRow}>
                    <RecipeImg
                      src={planItem!.recipeImgUrl}
                      variant="square"
                      style={styles.plannerImg}
                    />
                    <Text
                      style={styles.recipeName}
                      numberOfLines={2}
                      onPress={() => handleRecipeTap(planItem!.recipeId)}
                    >
                      {planItem!.recipeName}
                    </Text>
                  </View>
                ) : (
                  <>
                    {isSnack && <View style={styles.snackDivider} />}
                    <SearchSheet
                      selectedMealCategory={meal}
                      onRecipeTap={(rec) => handleSearchedRecipe(rec, meal)}
                      isMainMeal={!isSnack}
                    />
                  </>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button variant="primary" onPress={() => { /* TODO: implement later */ }}>
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
  mealBase: {
    width: "100%",
  },
  mealBox: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    minHeight: 100,
    padding: theme.spacing[2],
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "80%",
    position: "relative",
  },
  mealType: {
    position: "absolute",
    top: theme.spacing[1],
    left: "50%",
    transform: [{ translateX: -50 }],
    textTransform: "capitalize",
    fontSize: 12,
    color: theme.colors.primary,
  },
  snackBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
  },
  snackDivider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.4,
  },
  recipeBox: {
    borderColor: "transparent",
    backgroundColor: theme.colors.bgCard,
    padding: 0,
  },
  recipeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[5],
    width: "100%",
  },
  plannerImg: {
    height: 100,
    width: 100,
    borderRadius: theme.radius.md,
  },
  recipeName: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    marginTop: theme.spacing[6],
    alignItems: "center",
  },
});
