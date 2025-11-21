import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

import { AppDispatch, RatingCategory } from "@/api/types";
import { saveSoloRatingThunk } from "@/store/recipes-store";
import { getRatingAverage } from "@/utils";

import { theme } from "@/constants/theme/index";
import { StarRating } from "@/components/ui/"; // your component
import { BottomSheet } from "@/components/ui/bottom-sheet"; // the component you posted
import { RATING_CATEGORIES } from "@/constants/recipes.const";

interface RatingsSheetProps {
  recipeId: string;
  ratingCategories: Partial<Record<RatingCategory, number>> | undefined;
}

export default function RatingsSheet({
  recipeId,
  ratingCategories,
}: RatingsSheetProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const total = getRatingAverage(ratingCategories);

  const handleRatingSave = (cat: RatingCategory, value: number) => {
    dispatch(saveSoloRatingThunk({ recipeId, cat, value }));
  };

  return (
    <View style={styles.panel}>
      {/* Summary: tap to open */}
      <View style={styles.openRow}>
        <StarRating value={total} showValue onChange={() => setOpen(true)} />
      </View>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Rate the recipe"
        size="auto"
        showHandle
      >
        <View style={styles.sheetContent}>
          {RATING_CATEGORIES.map((cat) => (
            <View key={cat} style={styles.ratingRow}>
              <Text style={styles.ratingLabel}>{cat}</Text>

              <StarRating
                value={ratingCategories?.[cat] ?? 0}
                onChange={(val) => handleRatingSave(cat, val)}
              />
            </View>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
  },
  openRow: {
    alignSelf: "flex-start",
  },
  sheetContent: {
    paddingVertical: theme.spacing[4],
    gap: theme.spacing[4],
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing[4],
  },
  ratingLabel: {
    width: 100,
    textTransform: "capitalize",
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});
