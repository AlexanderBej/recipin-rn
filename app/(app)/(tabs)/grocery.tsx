import React, { useState } from "react";
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

import { selectGroceryRecipes, toggelItem, fetchRecipeById } from "@/store";
import { AppDispatch } from "@/api/types";

import { useClipboard } from "@/hooks";
import { buildIngredient, buildPageIngredientsText } from "@/utils";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import CopySheet from "@/components/sheets/copy-sheet"; // new component we create

import { theme } from "@/constants/theme/index";

export default function GroceryScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const groceryRecipes = useSelector(selectGroceryRecipes);
  const { copy, copied } = useClipboard();

  const [copiedState, setCopiedState] = useState({
    all: false,
    remaining: false,
  });

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
            style={{ flex: 1 }}
          >
            <View style={{ position: "absolute", left: 10, top: 10 }}>
              {copied && copiedState.all && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={theme.colors.success}
                />
              )}
            </View>
            <Text style={{ color: theme.colors.textPrimary }}>Copy All</Text>
          </Button>

          <Button
            variant="primary"
            onPress={handleCopyRemaining}
            style={{ flex: 1 }}
          >
            <View style={{ position: "absolute", left: 10, top: 10 }}>
              {copied && copiedState.remaining && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={theme.colors.success}
                />
              )}
            </View>
            <Text style={{ color: "#fff" }}>Copy Remaining</Text>
          </Button>
        </View>

        {/* LIST OF GROCERY RECIPES */}
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
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
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
              <View key={item.id} style={{ marginBottom: theme.spacing[2] }}>
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

        {/* CLEAR BUTTON */}
        <Button
          variant="danger"
          disabled={!groceryRecipes.length}
          style={{ marginTop: theme.spacing[4] }}
        >
          Clear grocery list
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  copyRow: {
    flexDirection: "row",
    gap: theme.spacing[2],
    marginBottom: theme.spacing[5],
  },
});
