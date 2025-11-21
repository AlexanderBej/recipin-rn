import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { RecipeCard as RecipeCardModel } from "@/api/models/index";
import RecipeImg from "../ui/recipe-img";
import { Favorite } from "../ui/favorite";
import { CATEGORY_META } from "@/constants/recipes.const";
import { Chip } from "../ui/chip";
import { theme } from "@/constants/theme/index";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  recipe: RecipeCardModel;
}

export default function DetailedCard({ recipe }: Props) {

  const categoryMeta = CATEGORY_META[recipe.category];

  const CategoryIcon = categoryMeta.icon;

  const difficultyNum =
    recipe?.difficulty === "easy"
      ? 1
      : recipe?.difficulty === "advanced"
        ? 3
        : 2;

  const difficultyColor =
    recipe.difficulty === "easy"
      ? "#4CAF50"
      : recipe.difficulty === "intermediate"
        ? "#FFC107"
        : "#F44336";

  return (
    <View style={styles.container}>
      <Favorite
        isFavorite={recipe.isFavorite ?? false}
        style={styles.favoriteBtn}
      />

      <RecipeImg src={recipe.imageUrl} variant="square" style={styles.img} />

      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.title}>
          {recipe.title}
        </Text>

        <View style={styles.catRow}>
          <View
            style={[
              styles.categoryBox,
              {
                backgroundColor: `${categoryMeta.color}22`,
                borderColor: categoryMeta.color,
              },
            ]}
          >
            <CategoryIcon color="white" size={10} />
            <Text style={styles.categoryLabel}>{categoryMeta.label}</Text>
          </View>
          <View style={styles.difficulty}>
            {Array.from({ length: difficultyNum }).map((_, i) => (
              <Ionicons
                key={i}
                name="flash"
                size={20}
                color={difficultyColor}
              />
            ))}
          </View>
        </View>

        <Text numberOfLines={2} style={styles.excerpt}>
          {recipe.excerpt}
        </Text>

        <View style={styles.tagsRow}>
          {recipe.tags.map((tag) => (
            <Chip key={tag} tag={tag} active onToggle={() => {}} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    backgroundColor: theme.colors.bgCard,
    borderRadius: 12,
    flexDirection: "row",
  },
  favoriteBtn: {
    position: "absolute",
    top: theme.spacing[2],
    left: theme.spacing[2],
    zIndex: 10,
  },
  img: {
    width: 140,
    height: 140,
    borderTopLeftRadius: theme.spacing[3],
    borderBottomLeftRadius: theme.spacing[3],
  },
  details: {
    flex: 1,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    marginBottom: theme.spacing[1],
  },
  catRow: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  categoryBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  difficulty: {
    gap: 1,
    flexDirection: "row"
  },
  categoryLabel: {
    color: "white",
    fontSize: 10,
    marginLeft: theme.spacing[1],
  },
  excerpt: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 6,
    marginTop: 4,
    overflow: "hidden"
  },
});
