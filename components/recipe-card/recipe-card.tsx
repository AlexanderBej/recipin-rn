import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { router } from "expo-router";

import { RecipeCard as RecipeCardModel } from "@/api/models/index";
import { AppDispatch, fetchRecipeById } from "@/store/index";
import FavoriteCard from "./favorite-card";
import DetailedCard from "./detailed-card";

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

  return (
    <Pressable onPress={openDetails} style={styles.cardWrapper}>
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
});
