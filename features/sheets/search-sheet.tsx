// components/planner/SearchSheet.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { RecipeCard } from "@/api/models";
import { RecipeCategory } from "@/api/types";
import { listRecipeCardsByOwnerPaged } from "@/api/services";
import { selectAuthUserId } from "@/store/auth-store";
import { theme } from "@/constants/theme/index";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Input } from "@/components/ui/input";
import RecipeImg from "@/components/ui/recipe-img"; // adjust path

interface SearchSheetProps {
  selectedMealCategory: RecipeCategory;
  onRecipeTap: (rec: RecipeCard) => void;
  isMainMeal?: boolean;
  trigger?: (opts: { open: () => void }) => React.ReactNode;
}

const SearchSheet: React.FC<SearchSheetProps> = ({
  selectedMealCategory,
  onRecipeTap,
  isMainMeal = true,
  trigger,
}) => {
  const uid = useSelector(selectAuthUserId);

  const [open, setOpen] = useState(false);
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPlannerRecipes = useCallback(
    async (initial = false) => {
      if (!uid) return;
      setLoading(true);
      try {
        const { items, nextStartAfterTitle } =
          await listRecipeCardsByOwnerPaged(uid, {
            pageSize: 24,
            startAfterTitle: initial ? null : cursor,
            filters: {
              // category: selectedMealCategory,
              searchTerm,
            },
          });

        setRecipes((prev) => (initial ? items : [...prev, ...items]));
        setCursor(nextStartAfterTitle);
      } finally {
        setLoading(false);
      }
    },
    [uid, cursor, searchTerm]
  );

  // reload when sheet opens or filters change
  useEffect(() => {
    if (!open) return;
    loadPlannerRecipes(true);
  }, [open, searchTerm, selectedMealCategory, loadPlannerRecipes]);

  const handleRecipePress = (rec: RecipeCard) => {
    onRecipeTap(rec);
    setOpen(false);
  };

  const defaultTrigger = (
    <TouchableOpacity
      onPress={() => setOpen(true)}
      accessibilityLabel="Open search recipe sheet"
    >
      <Ionicons
        name={isMainMeal ? "add-circle" : "add-circle-outline"}
        size={32}
        color={isMainMeal ? theme.colors.primary : theme.colors.textPrimary}
      />
    </TouchableOpacity>
  );

  return (
    <>
      {/* Trigger */}
      {trigger ? trigger({ open: () => setOpen(true) }) : defaultTrigger}

      {/* Sheet */}
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Search recipe"
        size="tall"
        showHandle
      >
        <View style={styles.container}>
          <Input
            placeholder="Search by title"
            value={searchTerm}
            onChangeText={setSearchTerm}
            prefix="search"
          />

          <View style={styles.results}>
            {loading && recipes.length === 0 ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            ) : recipes.length === 0 ? (
              <Text style={styles.emptyText}>No recipes found</Text>
            ) : (
              recipes.map((rec) => (
                <TouchableOpacity
                  key={rec.id}
                  style={styles.recipeRow}
                  onPress={() => handleRecipePress(rec)}
                  activeOpacity={0.7}
                >
                  <RecipeImg
                    src={rec.imageUrl}
                    variant="thumb"
                    style={styles.recipeImg}
                  />
                  <Text style={styles.recipeTitle} numberOfLines={2}>
                    {rec.title}
                  </Text>
                </TouchableOpacity>
              ))
            )}

            {/* Optional "Load more" */}
            {cursor && (
              <TouchableOpacity
                style={styles.loadMoreBtn}
                onPress={() => loadPlannerRecipes(false)}
                disabled={loading}
              >
                <Text style={styles.loadMoreText}>
                  {loading ? "Loading…" : "Load more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BottomSheet>
    </>
  );
};

export default SearchSheet;

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    marginTop: theme.spacing[2],
  },
  results: {
    width: "100%",
    marginTop: theme.spacing[3],
    gap: theme.spacing[2],
  },
  loadingRow: {
    paddingVertical: theme.spacing[3],
    alignItems: "center",
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  recipeRow: {
    height: 70,
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
  },
  recipeImg: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
  },
  recipeTitle: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  loadMoreBtn: {
    alignSelf: "flex-end",
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
  },
  loadMoreText: {
    color: theme.colors.primary,
    fontSize: 13,
  },
});
