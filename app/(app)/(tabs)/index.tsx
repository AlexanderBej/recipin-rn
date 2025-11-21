import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FilterSheet } from "@/components/sheets/filter-sheet"; // RN version using bottom sheet
import RecipeCard from "@/components/recipe-card/recipe-card"; // RN version
import CardLoading from "@/components/ui/card-loading"; // RN version (or ActivityIndicator wrapper)
import {
  AppDispatch,
  selectAuthUserId,
  selectAllRecipes,
  selectRecipesLoading,
  selectRecipesFavorites,
  selectRecipesLastFilters,
  selectMyCardsHasMore,
  fetchMyRecipeCardsPage,
} from "@/store/index"; // or wherever you export it
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";

import { RecipeCardFilters } from "@/api/models/index";
import { Button } from "@/components/ui/button";
import { theme } from "@/constants/theme/index";

const LibraryScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const uid = useSelector(selectAuthUserId);
  const recipes = useSelector(selectAllRecipes);
  const recipesLoading = useSelector(selectRecipesLoading);
  const favorites = useSelector(selectRecipesFavorites);
  const lastFilters = useSelector(selectRecipesLastFilters);
  const hasMore = useSelector(selectMyCardsHasMore);

  const [recFilters, setRecFilters] = useState<RecipeCardFilters>({
    searchTerm: lastFilters?.searchTerm ?? "",
    tag: lastFilters?.tag ?? "",
    category: lastFilters?.category,
    difficulty: lastFilters?.difficulty,
  });

  const lastSearchRef = useRef<string | undefined>("");
  const lastTagsKeyRef = useRef<string | undefined>("");
  const lastCategoryKeyRef = useRef<string | undefined>("");
  const lastDifficultyKeyRef = useRef<string | undefined>("");

  // Debounced fetch whenever filters change
  useEffect(() => {
    if (!uid) return;

    const { searchTerm, tag, category, difficulty } = recFilters;

    if (
      searchTerm === lastSearchRef.current &&
      tag === lastTagsKeyRef.current &&
      category === lastCategoryKeyRef.current &&
      difficulty === lastDifficultyKeyRef.current
    ) {
      return;
    }

    lastSearchRef.current = searchTerm;
    lastTagsKeyRef.current = tag;
    lastCategoryKeyRef.current = category;
    lastDifficultyKeyRef.current = difficulty;

    const handler = setTimeout(() => {
      dispatch(
        fetchMyRecipeCardsPage({
          uid,
          reset: true,
          filters: { tag, searchTerm, category, difficulty },
        })
      );
    }, 300);

    return () => clearTimeout(handler);
  }, [uid, recFilters, dispatch]);

  const handleLoadMore = () => {
    if (!uid || !hasMore || recipesLoading) return;

    dispatch(
      fetchMyRecipeCardsPage({
        uid,
        reset: false,
        filters: {
          tag: recFilters.tag || undefined,
          searchTerm: recFilters.searchTerm || undefined,
          category: recFilters.category || undefined,
          difficulty: recFilters.difficulty || undefined,
        },
      })
    );
  };

  const renderSelectedChip = (
    key: "category" | "difficulty" | "tag",
    chip: string
  ) => (
    <View style={styles.selectedFilter}>
      <TouchableOpacity
        style={styles.filterRemove}
        onPress={() =>
          setRecFilters((prev) => ({
            ...prev,
            [key]: undefined,
          }))
        }
      >
        <Ionicons
          name="close-circle"
          size={18}
          color="#ffffff"
          style={styles.filterRemoveIcon}
        />
      </TouchableOpacity>

      <Chip
        tag={chip}
        active
        onToggle={() =>
          setRecFilters((prev) => ({
            ...prev,
            [key]: undefined,
          }))
        }
      />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.searchRow}>
          <Input
            placeholder="Search by name or ingredient"
            value={recFilters.searchTerm}
            prefix="search"
            containerStyle={styles.searchInput}
            onChangeText={(text) =>
              setRecFilters((prev) => ({ ...prev, searchTerm: text }))
            }
            handleReset={() =>
              setRecFilters((prev) => ({ ...prev, searchTerm: "" }))
            }
          />

          <FilterSheet
            selected={{
              tag: recFilters.tag,
              category: recFilters.category,
              difficulty: recFilters.difficulty,
            }}
            onChange={(filt) =>
              setRecFilters((prev) => ({
                ...prev,
                tag: filt.tag,
                category: filt.category,
                difficulty: filt.difficulty,
              }))
            }
          />
        </View>

        <View style={styles.selectedFiltersContainer}>
          {recFilters.tag ? renderSelectedChip("tag", recFilters.tag) : null}
          {recFilters.category
            ? renderSelectedChip("category", recFilters.category)
            : null}
          {recFilters.difficulty
            ? renderSelectedChip("difficulty", recFilters.difficulty)
            : null}
        </View>
      </View>

      {/* Favorites horizontal list */}
      <View style={styles.favoritesSection}>
        <Text style={styles.heading}>Favorites</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.favoritesList}
        >
          {favorites.map((favRec) => (
            <View key={favRec.id} style={styles.favoriteCardWrapper}>
              <RecipeCard recipe={favRec} type="favorite" />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* All recipes grid-ish list (single column for now) */}
      <View style={styles.allRecipesSection}>
        <Text style={styles.heading}>All recipes</Text>

        <View style={styles.recipesList}>
          {!recipesLoading && recipes && recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} type="detailed" />
            ))
          ) : recipesLoading ? (
            <CardLoading />
          ) : (
            <Text style={styles.emptyText}>No recipes found</Text>
          )}
        </View>

        {hasMore && (
          <View style={styles.hasMoreBtnWrapper}>
            <Button variant="neutral" onPress={handleLoadMore}>
              Load More
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgMain,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[5],
  },
  filters: {
    width: "100%",
    gap: theme.spacing[3],
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[3],
    width: "100%",
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    width: "80%",
  },
  selectedFiltersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
    flexWrap: "wrap",
  },
  selectedFilter: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.md,
    backgroundColor: "#cc6200", // $color-primary-dark-ish
    overflow: "hidden",
  },
  filterRemove: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  filterRemoveIcon: {
    marginTop: 1,
  },
  favoritesSection: {
    marginTop: theme.spacing[4],
  },
  heading: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  favoritesList: {
    gap: theme.spacing[3],
    paddingRight: theme.spacing[4],
  },
  favoriteCardWrapper: {
    marginRight: theme.spacing[3],
  },
  allRecipesSection: {
    marginTop: theme.spacing[6],
  },
  recipesList: {
    gap: theme.spacing[4],
  },
  emptyText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: theme.spacing[2],
  },
  hasMoreBtnWrapper: {
    marginTop: 20,
    alignItems: "flex-end",
    height: 100,
  },
});
