import "react-native-get-random-values";
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { AppDispatch } from "@/api/types";
import { GroceryItem } from "@/api/models";
import {
  removeRecipe,
  selectRecipesCurrent,
  toggleFavorite,
} from "@/store/recipes-store";
import {
  addGroceryRecipe,
  makeSelectHasGroceryRecipe,
} from "@/store/grocery-store";

import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { Favorite } from "@/components/ui/favorite";
import RecipeImg from "@/components/ui/recipe-img";

import { buildIngredient, formatHoursAndMinutes, toDateOrNull } from "@/utils";
import { theme } from "@/constants/theme/index";
import { CATEGORY_META } from "@/constants/recipes.const";
import { useToast } from "@/providers/toast";
import { LinearGradient } from "expo-linear-gradient";
import { ConfirmModal, PlannerModal, RatingsSheet } from "@/features";

export default function RecipeDetailsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const recipe = useSelector(selectRecipesCurrent);
  const isRecipeInGrocery = useSelector(
    makeSelectHasGroceryRecipe(recipe?.id ?? "")
  );

  const { showToast } = useToast();

  const [portions, setPortions] = useState<number>(recipe?.servings ?? 1);

  if (!recipe) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Recipe not found</Text>
      </View>
    );
  }

  const prepTime = formatHoursAndMinutes(recipe?.cookMinutes ?? 1);
  const cookTime = formatHoursAndMinutes(recipe?.prepMinutes ?? 1);

  // easy = 1, intermediate/null = 2, advanced = 3
  const difficultyNum =
    recipe?.difficulty === "easy"
      ? 1
      : recipe?.difficulty === "advanced"
        ? 3
        : 2;

  const updatedAtDate = toDateOrNull(recipe?.updatedAt);

  const handleAddToGrocery = () => {
    if (!recipe) {
      showToast({
        type: "error",
        message: "Recipe could not be found. Maybe refresh?",
      });
      return;
    }
    if (isRecipeInGrocery) {
      showToast({
        type: "warning",
        message: "Already in grocery list. I'll redirect you (☞ ͡° ͜ʖ ͡°)☞",
      });
      router.push("/grocery");
      return;
    }

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

    router.push("/grocery");
  };

  const handleFavoriteTap = () => {
    if (recipe.id) {
      dispatch(
        toggleFavorite({ recipeId: recipe.id, favorite: !recipe.isFavorite })
      );
    }
  };

  const handleRecipeRemove = async () => {
    if (!recipe?.id) return;
    await dispatch(removeRecipe(recipe.id));
    router.push("/"); // or "/library" depending on how you mapped routes
  };

  const categoryKey = recipe.category ?? "appetizers";
  const categoryMeta = CATEGORY_META[categoryKey];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bgMain }}
      contentContainerStyle={{
        padding: theme.spacing[4],
        paddingBottom: 120,
      }}
    >
      <View style={styles.container}>
        {/* IMAGE + TITLE + FAVORITE */}
        <View style={styles.imageWrapper}>
          <RecipeImg
            src={recipe.imageUrl}
            // alt={recipe.title}
            variant="detail"
          />

          {/* Overlay gradient-ish effect if you want – for now just darken bottom */}
          <LinearGradient
            colors={["#1e1e1e00", "#1e1e1e00", "#2a2a2a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.favoriteWrapper}>
            <Favorite
              small={false}
              isFavorite={recipe?.isFavorite ?? false}
              onToggle={handleFavoriteTap}
            />
          </View>

          <Text style={styles.recipeTitle}>{recipe.title}</Text>
        </View>

        {/* ACTION ROW: portions, times, difficulty */}
        <View style={styles.actionRow}>
          {/* Portions */}
          <View style={styles.portionsContainer}>
            <TouchableOpacity
              style={styles.portionsToggler}
              onPress={() => setPortions((p) => Math.max(1, p - 1))}
            >
              <Ionicons
                name="remove"
                size={16}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
            <Text style={styles.portionsValue}>{portions}</Text>
            <TouchableOpacity
              style={styles.portionsToggler}
              onPress={() => setPortions((p) => p + 1)}
            >
              <Ionicons name="add" size={16} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Times */}
          <View style={styles.timeContainer}>
            <View style={styles.timeBox}>
              <Ionicons
                name="time-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.timeText}>{prepTime}</Text>
            </View>
            <View style={styles.timeBox}>
              <Ionicons
                name="time-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.timeText}>{cookTime}</Text>
            </View>
          </View>

          {/* Difficulty */}
          <View style={styles.difficultyContainer}>
            <View style={styles.difficultyIcons}>
              {Array.from({ length: difficultyNum }).map((_, i) => (
                <Ionicons
                  key={i}
                  name="flash"
                  size={18}
                  color={theme.colors.primary}
                />
              ))}
            </View>
          </View>
        </View>

        {/* TAGS + CATEGORY */}
        <View style={styles.tagsRow}>
          {recipe.tags?.map((tag) => (
            <Chip key={tag} tag={tag} active onToggle={() => {}} />
          ))}

          <View
            style={[
              styles.categoryBox,
              {
                backgroundColor: `${categoryMeta.color}55`,
                borderColor: categoryMeta.color,
              },
            ]}
          >
            {categoryMeta.icon({ size: 14, color: theme.colors.textPrimary })}
            <Text style={styles.categoryText}>{categoryMeta.label}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* DESCRIPTION + PLANNER */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Description</Text>
            <PlannerModal recipe={recipe} />
          </View>
          <Text style={styles.bodyText}>{recipe.description}</Text>
          <Text style={styles.lastUpdated}>
            {updatedAtDate
              ? `Last updated: ${format(updatedAtDate, "MMMM do, yyyy")}`
              : "Last updated: —"}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* INGREDIENTS + ADD TO GROCERY */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Ingredients</Text>
            <TouchableOpacity onPress={handleAddToGrocery}>
              <MaterialIcons
                name="local-grocery-store"
                size={24}
                color={
                  isRecipeInGrocery
                    ? theme.colors.primary
                    : theme.colors.textPrimary
                }
              />
            </TouchableOpacity>
          </View>

          {recipe.ingredients.map((ingr, index) => (
            <View key={index} style={styles.ingredientLine}>
              <Checkbox
                value={true}
                label={buildIngredient(ingr)}
                // onChange={() => {}}
              />
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* STEPS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Steps</Text>
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepLine}>
              <Text style={styles.stepNumber}>{index + 1}.</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* RATING */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Rating</Text>
          <RatingsSheet
            recipeId={recipe.id}
            ratingCategories={recipe.ratingCategories}
          />
        </View>

        <View style={styles.divider} />

        {/* DELETE RECIPE */}
        <ConfirmModal
          buttonLabel="Delete Recipe"
          message="Are you sure you want to delete this recipe? This process is irreversible!"
          handleConfirm={handleRecipeRemove}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
  },
  container: {
    width: "100%",
  },

  imageWrapper: {
    position: "relative",
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  favoriteWrapper: {
    position: "absolute",
    top: theme.spacing[2],
    right: theme.spacing[2],
    zIndex: 2,
  },
  recipeTitle: {
    position: "absolute",
    bottom: theme.spacing[2],
    left: theme.spacing[3],
    zIndex: 2,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.3,
    marginVertical: theme.spacing[4],
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: theme.spacing[3],
    marginTop: theme.spacing[3],
  },

  portionsContainer: {
    backgroundColor: theme.colors.bgCard,
    padding: theme.spacing[2],
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[3],
  },
  portionsToggler: {
    backgroundColor: theme.colors.bgCardLight,
    borderRadius: theme.radius.md,
    padding: 6,
  },
  portionsValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },

  timeContainer: {
    flexDirection: "row",
    gap: theme.spacing[3],
  },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
  },
  timeText: {
    color: theme.colors.textPrimary,
  },

  difficultyContainer: {},
  difficultyIcons: {
    flexDirection: "row",
    gap: 4,
  },

  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  categoryBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
    paddingVertical: theme.spacing[1] / 2,
    borderWidth: 1,
    borderRadius: theme.radius.md,
  },
  categoryText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
  },

  section: {
    width: "100%",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sectionHeading: {
    marginBottom: theme.spacing[3],
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  bodyText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  lastUpdated: {
    marginTop: theme.spacing[2],
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  ingredientLine: {
    marginBottom: theme.spacing[1],
  },

  stepLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing[2],
  },
  stepNumber: {
    marginRight: theme.spacing[2],
    color: theme.colors.primary,
    fontWeight: "600",
  },
  stepText: {
    flex: 1,
    color: theme.colors.textPrimary,
  },
});
