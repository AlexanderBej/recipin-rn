import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { RecipeCard as RecipeCardModel } from "@/api/models/index";
import { getRatingAverage } from "@/utils/index";
import RecipeImg from "../ui/recipe-img";
import { StarRating } from "../ui/star-ratings";
import { Favorite } from "../ui/favorite";


interface Props {
  recipe: RecipeCardModel;
}

export default function FavoriteCard({ recipe }: Props) {
  const total = getRatingAverage(recipe.ratingCategories);

  return (
    <View style={styles.container}>
      <Favorite
        isFavorite={recipe.isFavorite ?? false}
        style={styles.favoriteBtn}
      />
      <RecipeImg
        src={recipe.imageUrl}
        variant="landscape"
        style={styles.image}
      />

      <View style={styles.details}>
        <Text style={styles.title}>{recipe.title}</Text>
        <StarRating value={total} small showValue />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
  },
  details: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    color: "white",
    marginBottom: 4,
  },
  favoriteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 10,
  },
});
