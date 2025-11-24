import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { router } from "expo-router";

import { RecipeCard as RecipeCardModel } from "@/api/models/index";
import { AppDispatch, fetchRecipeById, toggleFavorite } from "@/store/index";
import FavoriteCard from "./favorite-card";
import DetailedCard from "./detailed-card";
import { Favorite } from "../../components/ui";

interface Props {
  recipe: RecipeCardModel;
  type: "favorite" | "detailed";
}

export default function RecipeCard({ recipe, type }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const openDetails = () => {
    dispatch(fetchRecipeById(recipe.id));
    router.push(`/recipe/${recipe.id}`);
  };

  const handleFavoriteTap = () => {
    if (recipe.id) {
      dispatch(
        toggleFavorite({ recipeId: recipe.id, favorite: !recipe.isFavorite })
      );
    }
  };

  return (
    <Pressable onPress={openDetails} style={styles.cardWrapper}>
      <Favorite
        isFavorite={recipe.isFavorite ?? false}
        style={type === "favorite" ? styles.favFavorite : styles.detFavorite}
        onToggle={handleFavoriteTap}
      />
      {type === "favorite" ? (
        <FavoriteCard recipe={recipe} />
      ) : (
        <DetailedCard recipe={recipe} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  favFavorite: {
    top: 6,
    right: 6,
  },
  detFavorite: {
    left: 110,
  },
});
