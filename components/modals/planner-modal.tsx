import React, { useMemo, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

import { AppDispatch, MealSlot } from "@/api/types";
import { PlanItem, RecipeEntity } from "@/api/models";
import {
  addPlanItemThunk,
  selectPlannerWeekStart,
} from "@/store/planner-store";
import { selectAuthUserId } from "@/store/auth-store";

import { getWeekDays, getWeekStart } from "@/utils";
import { theme } from "@/constants/theme/index";

import { Modal } from "@/components/ui/";
import { Button } from "@/components/ui/button";
import { MEAL_SLOTS } from "@/constants/planner.const";

type Period = "current" | "next";

interface Props {
  recipe: RecipeEntity | null;
}

export default function PlannerModal({ recipe }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const weekStartISO = useSelector(selectPlannerWeekStart);
  const uid = useSelector(selectAuthUserId);

  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("current");
  const [submitting, setSubmitting] = useState(false);

  // --- Anchor week start (Monday)
  const anchorWeekStart = useMemo(() => {
    if (weekStartISO) return new Date(weekStartISO);
    return getWeekStart(new Date(), 1); // Monday
  }, [weekStartISO]);

  // --- Visible week (current or next)
  const visibleWeekStart = useMemo(() => {
    if (period === "current") return anchorWeekStart;
    const d = new Date(anchorWeekStart);
    d.setDate(d.getDate() + 7);
    return d;
  }, [anchorWeekStart, period]);

  const days = useMemo(() => getWeekDays(visibleWeekStart), [visibleWeekStart]);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(
    format(today, "yyyy-MM-dd")
  );
  const [selectedMeal, setSelectedMeal] = useState<MealSlot>("lunch");

  // When switching to "next week", default select first day
  useEffect(() => {
    if (!days.length || period === "current") return;
    setSelectedDateISO(format(days[0], "yyyy-MM-dd"));
  }, [days, period]);

  const onConfirmClick = async () => {
    if (!selectedDateISO || !recipe || !uid) return;

    setSubmitting(true);

    try {
      const planItem: Omit<PlanItem, "id"> = {
        date: selectedDateISO,
        meal: selectedMeal,
        recipeId: recipe.id,
        recipeName: recipe.title,
        recipeImgUrl: recipe.imageUrl,
        userId: uid,
      };

      await dispatch(addPlanItemThunk({ uid, item: planItem }));

      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Ionicons
          name="calendar-outline"
          size={24}
          color={theme.colors.primaryLight}
        />
      </TouchableOpacity>

      <Modal
        isOpen={open}
        onClose={() => (!submitting ? setOpen(false) : null)}
        title="Plan a meal"
      >
        <View style={styles.body}>
          {/* Week Selector */}
          <View style={styles.weekSelector}>
            <TouchableOpacity
              style={[
                styles.periodBtn,
                period === "current" && styles.periodBtnActive,
              ]}
              onPress={() => setPeriod("current")}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  period === "current" && styles.periodBtnActiveText,
                ]}
              >
                This Week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodBtn,
                period === "next" && styles.periodBtnActive,
              ]}
              onPress={() => setPeriod("next")}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  period === "next" && styles.periodBtnActiveText,
                ]}
              >
                Next Week
              </Text>
            </TouchableOpacity>
          </View>

          {/* Day Grid */}
          <View style={styles.daysGrid}>
            {days.map((d) => {
              const iso = format(d, "yyyy-MM-dd");
              const isSelected = iso === selectedDateISO;
              const isPast = d < today;

              return (
                <TouchableOpacity
                  key={iso}
                  disabled={isPast}
                  onPress={() => setSelectedDateISO(iso)}
                  style={[
                    styles.dayPill,
                    isSelected && styles.dayPillSelected,
                    isPast && styles.dayPillDisabled,
                  ]}
                >
                  <Text style={styles.dayName}>{format(d, "EEE")}</Text>
                  <Text style={styles.dayNumber}>{format(d, "d")}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Meal Selector */}
          <View style={styles.mealSelector}>
            {MEAL_SLOTS.map((meal) => (
              <TouchableOpacity
                key={meal}
                onPress={() => setSelectedMeal(meal)}
                style={[
                  styles.mealBox,
                  selectedMeal === meal && styles.mealBoxSelected,
                ]}
              >
                <Text
                  style={[
                    styles.mealText,
                    selectedMeal === meal && styles.mealTextSelected,
                  ]}
                >
                  {meal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            variant="primary"
            disabled={!selectedDateISO || !selectedMeal}
            isLoading={submitting}
            onPress={onConfirmClick}
            style={styles.saveBtn}
          >
            Save
          </Button>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingVertical: theme.spacing[3],
  },

  /** WEEK SELECTOR */
  weekSelector: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.neutral,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  periodBtnText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  periodBtnActive: {
    backgroundColor: theme.colors.bgCardLight,
    borderColor: theme.colors.primary,
  },
  periodBtnActiveText: {
    color: theme.colors.primary,
  },

  /** DAYS GRID */
  daysGrid: {
    marginTop: theme.spacing[6],
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayPill: {
    width: "13%",
    aspectRatio: 1,
    backgroundColor: theme.colors.neutral,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    padding: 4,
  },
  dayPillSelected: {
    backgroundColor: theme.colors.primary,
  },
  dayPillDisabled: {
    opacity: 0.4,
  },
  dayName: {
    fontWeight: "600",
    fontSize: 11,
    color: theme.colors.textPrimary,
  },
  dayNumber: {
    fontSize: 12,
    color: theme.colors.textPrimary,
  },

  /** MEAL SELECTOR */
  mealSelector: {
    marginTop: theme.spacing[6],
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  mealBox: {
    width: "23%",
    height: 45,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.neutral,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bgMain,
  },
  mealBoxSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.bgCardLight,
  },
  mealText: {
    textTransform: "capitalize",
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  mealTextSelected: {
    color: theme.colors.primary,
  },

  saveBtn: {
    marginTop: theme.spacing[6],
    alignSelf: "center",
  },
});
