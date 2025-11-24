import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

import { theme } from "@/constants/theme/index";
import { useDispatch, useSelector } from "react-redux";
import {
  addPlanItemThunk,
  AppDispatch,
  fetchRecipeById,
  makeSelectPlanForDate,
  removePlanItemThunk,
  RootState,
  selectAuthUserId,
} from "@/store";
import { MealSlot, PlanItem, RecipeCard } from "@/api";
import { RecipeImg } from "@/components";
import { SearchSheet } from "../sheets";
import { ConfirmModal } from "../modals";

interface PlanItemBoxProps {
  meal: MealSlot;
  selectedDateISO: string;
}

const PlanItemBox: React.FC<PlanItemBoxProps> = ({ meal, selectedDateISO }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const uid = useSelector(selectAuthUserId);
  const selectPlanForDate = useMemo(makeSelectPlanForDate, []);

  const itemsForSelectedDate = useSelector((state: RootState) =>
    selectPlanForDate(state, selectedDateISO)
  );

  const getItemForSlot = (meal: MealSlot) =>
    itemsForSelectedDate.find((item) => item.meal === meal);

  const isSnack = meal === "snacks";
  const planItem = getItemForSlot(meal);

  const isRecipe = !!planItem;

  const renderRightActions = (item: PlanItem) => (
    <View style={styles.swipeActionsContainer}>
      <SearchSheet
        selectedMealCategory={meal}
        onRecipeTap={(rec) => handleReplacePlanItem(rec, item)}
        isMainMeal={!isSnack}
        trigger={({ open }) => (
          <TouchableOpacity
            style={[styles.swipeActionButton, styles.swipeReplace]}
            onPress={open}
          >
            <Text style={styles.swipeActionText}>Replace</Text>
          </TouchableOpacity>
        )}
      />

      <ConfirmModal
        message={
          item
            ? `Remove ${item.recipeName ?? "this item"} from planner?`
            : "Remove this item from planner?"
        }
        buttonLabel="Remove"
        handleConfirm={() => handleRemovePlanItem(item)}
        trigger={({ open, disabled }) => (
          // this becomes your *actual* Remove button
          <TouchableOpacity
            style={[styles.swipeActionButton, styles.swipeRemove]}
            onPress={() => {
              if (disabled) return;
              // set which item we’re removing, then open modal
              open();
            }}
          >
            <Text style={styles.swipeActionText}>Remove</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

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

  // remove a plan item
  const handleRemovePlanItem = (item: PlanItem) => {
    dispatch(removePlanItemThunk({ planItemId: item.id, date: item.date }));
  };

  // start replace flow (for now just log / TODO)
  const handleReplacePlanItem = (recipe: RecipeCard, item: PlanItem) => {
    console.log("Replace plan item", item);
    console.log("with recipe", recipe);

    // Later:
    // - open a bottom sheet SearchSheet preconfigured for this meal
    // - when user picks a recipe, dispatch an "update plan item" or remove+add
  };

  return (
    <View>
      {isRecipe ? (
        <Swipeable
          renderRightActions={() => renderRightActions(planItem!)}
          overshootRight={false}
        >
          <View
            style={[
              styles.mealBase,
              styles.recipeBox, // explicitly use recipe style here
            ]}
          >
            {/* Show meal label for recipes too */}
            <Text style={styles.mealType}>{meal}</Text>

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
          </View>
        </Swipeable>
      ) : (
        <View
          style={[
            styles.mealBase,
            !isSnack && styles.mealBox,
            isSnack && styles.snackBox,
          ]}
        >
          {/* For empty main meals: show label */}
          {!isSnack && <Text style={styles.mealType}>{meal}</Text>}

          {isSnack && <View style={styles.snackDivider} />}

          <SearchSheet
            selectedMealCategory={meal}
            onRecipeTap={(rec) => handleSearchedRecipe(rec, meal)}
            isMainMeal={!isSnack}
          />
        </View>
      )}
    </View>
  );
};

export default PlanItemBox;

const styles = StyleSheet.create({
  swipeActionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginVertical: theme.spacing[1],
  },
  swipeActionButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing[3],
    marginHorizontal: 2,
    borderRadius: theme.radius.md,
    minWidth: 80,
    height: "100%",
  },
  swipeReplace: {
    backgroundColor: theme.colors.bgCardLight,
  },
  swipeRemove: {
    backgroundColor: theme.colors.error ?? "#ef4444",
  },
  swipeActionText: {
    color: theme.colors.textPrimary ?? "#fff",
    fontSize: 13,
    fontWeight: "500",
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
    alignSelf: "center",
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
    borderRadius: theme.radius.lg,
    padding: 0,
    width: "100%",
    height: 100,
    flex: 1,
  },
  recipeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[5],
    width: "100%",
    height: "100%",
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
});
