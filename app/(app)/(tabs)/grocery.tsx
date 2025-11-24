import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import {
  selectGroceryRecipes,
  toggelItem,
  fetchRecipeById,
  clearGrocery,
} from "@/store";
import { AppDispatch, CombinedIngredient, GroceryViewMode } from "@/api/types";

import { useClipboard } from "@/hooks";
import { buildIngredient, buildPageIngredientsText, parseQuantity } from "@/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { theme } from "@/constants/theme/index";
import { CopySheet, ConfirmModal, GroceryModeToggle } from "@/features";
import { GroceryRecipe } from "@/api";

export default function GroceryScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const groceryRecipes = useSelector(selectGroceryRecipes);
  const { copy, copied } = useClipboard();

  const [mode, setMode] = useState<GroceryViewMode>("byRecipe");
  const [copiedState, setCopiedState] = useState({
    all: false,
    remaining: false,
  });

  
  const combinedIngredients = useMemo(
    () => buildCombinedIngredients(groceryRecipes),
    [groceryRecipes]
  );
  const [combChecked, setCombChecked] = useState<Record<string, boolean>>({})

  if (!groceryRecipes || groceryRecipes.length === 0) {
    return (
      <View style={{ padding: theme.spacing[4] }}>
        <Text style={{ fontSize: 16, color: theme.colors.textSecondary }}>
          Nothing in your grocery basket
        </Text>
      </View>
    );
  }

  const toggleItemChecked = (
    checked: boolean,
    recipeId: string,
    itemId: string
  ) => {
    dispatch(toggelItem({ recipeId, itemId, checked }));
  };

   const toggleCombItemChecked = (
    checked: boolean,
    name: string
  ) => {
    setCombChecked((prev) => {
      return {...prev, [name]: checked}
    });
  };

  const handleOpenRecipe = (id: string) => {
    dispatch(fetchRecipeById(id));
    router.push(`/recipe/${id}`);
  };

  const handleCopyAll = () => {
    copy(buildPageIngredientsText(groceryRecipes, { onlyUnchecked: false }));
    setCopiedState({ all: true, remaining: false });
  };

  const handleCopyRemaining = () => {
    copy(buildPageIngredientsText(groceryRecipes, { onlyUnchecked: true }));
    setCopiedState({ all: false, remaining: true });
  };

  const handleClearGroceries = () => {
    dispatch(clearGrocery());
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bgMain }}
      contentContainerStyle={{
        padding: theme.spacing[4],
        paddingBottom: 120,
      }}
    >
      <View style={{ backgroundColor: theme.colors.bgMain }}>
        {/* TOP COPY BUTTONS */}
        <View style={styles.copyRow}>
          <Button
            variant="secondary"
            onPress={handleCopyAll}
            style={styles.copyBtn}
          >
            {copied && copiedState.all ? (
              <View style={{ position: "absolute", left: 10, top: 10 }}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={theme.colors.success}
                />
              </View>
            ) : (
              <Text style={{ color: theme.colors.textPrimary }}>Copy All</Text>
            )}
          </Button>

          <View style={styles.toggleWrapper}>
            <GroceryModeToggle
              style={styles.toggle}
              mode={mode}
              onToggle={setMode}
            />
          </View>

          <Button
            variant="primary"
            onPress={handleCopyRemaining}
            style={styles.copyBtn}
          >
            {copied && copiedState.remaining ? (
              <View style={{ position: "absolute", left: 10, top: 10 }}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={theme.colors.success}
                />
              </View>
            ) : (
              <Text style={{ color: "#fff" }}>Copy Remaining</Text>
            )}
          </Button>
        </View>

        {/* LIST OF GROCERY RECIPES */}

        {mode === "combined" ? (
          <View>
            {combinedIngredients.map((ingr, index) => {
              const quantity = ingr.totalQuantity && ingr.totalQuantity > 0 ? ingr.totalQuantity.toString() : ''
              return (
              <View key={index} style={{ marginBottom: theme.spacing[2] }}>
                <Checkbox
                  value={combChecked[ingr.name]}
                  label={buildIngredient({
                    item: ingr.name,
                    unit: ingr.unit,
                    quantity,
                  })}
                  onValueChange={(v) => toggleCombItemChecked(v, ingr.name)}
                />
              </View>
            )
            })}
          </View>
        ) : (
          <View>
            {groceryRecipes.map((g) => (
              <View key={g.recipeId} style={{ marginBottom: theme.spacing[5] }}>
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: theme.spacing[3],
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                    onPress={() => handleOpenRecipe(g.recipeId)}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: theme.colors.primary,
                        fontWeight: "600",
                      }}
                    >
                      {g.title}
                    </Text>
                    <MaterialIcons
                      name="open-in-new"
                      size={18}
                      color={theme.colors.success}
                    />
                  </TouchableOpacity>

                  {/* Copy Sheet (replacement for CopyDropdown) */}
                  <CopySheet ingredients={g.items} size="small" />
                </View>

                {/* CHECKBOX ITEMS */}
                {g.items.map((item) => (
                  <View
                    key={item.id}
                    style={{ marginBottom: theme.spacing[2] }}
                  >
                    <Checkbox
                      value={item.checked}
                      label={buildIngredient({
                        item: item.name,
                        unit: item.unit,
                        quantity: item.quantity,
                      })}
                      onValueChange={(v) =>
                        toggleItemChecked(v, g.recipeId, item.id)
                      }
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* CLEAR BUTTON */}
        <ConfirmModal
          buttonLabel="Clear grocery list"
          message="Are you sure you want to clear you grocery list? This process is irreversible!"
          handleConfirm={handleClearGroceries}
        />
      </View>
    </ScrollView>
  );
}

function buildCombinedIngredients(recipes: GroceryRecipe[]): CombinedIngredient[] {
  const map = new Map<string, CombinedIngredient>();

  for (const recipe of recipes) {
    for (const ing of recipe.items) {
      const key = `${ing.name.toLowerCase()}|${ing.unit}`;

      if (!map.has(key)) {
        map.set(key, {
          name: ing.name,
          unit: ing.unit ?? '',
          totalQuantity: 0,
          recipes: [],
        });
      }

      const entry = map.get(key)!;
      const numericQty = parseQuantity(ing.quantity ?? '');

      entry.totalQuantity += numericQty;
      entry.recipes.push({
        recipeId: recipe.recipeId,
        title: recipe.title,
        quantity: numericQty,
        rawQuantity: String(ing.quantity),
        unit: ing.unit ?? '',
      });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}


const TOGGLE_SIZE = 50;

const styles = StyleSheet.create({
  copyRow: {
    flexDirection: "row",
    marginBottom: theme.spacing[8],
    marginTop: theme.spacing[5],
    justifyContent: "space-between",
    position: "relative",
    alignItems: "center",
  },
  copyBtn: {
    width: 140,
  },

  toggleWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  toggle: {
    margin: "auto",
    height: TOGGLE_SIZE,
    width: TOGGLE_SIZE,
    backgroundColor: theme.colors.bgCard,
    borderRadius: TOGGLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
