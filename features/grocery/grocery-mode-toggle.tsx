import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { GroceryViewMode } from "@/api";
import { theme } from "@/constants/theme/index";

interface Props {
  mode: GroceryViewMode;
  style?: StyleProp<ViewStyle>;
  onToggle: (next: GroceryViewMode) => void;
}

export const GroceryModeToggle: React.FC<Props> = ({
  mode,
  style,
  onToggle,
}) => {
  const isCombined = mode === "combined";

  const handlePress = () => {
    const next = isCombined ? "byRecipe" : "combined";
    console.log('log', next);
    
    onToggle(next);
  };

  const pressableStyle = style ? [style, styles.button] : styles.button;

  return (
    <Pressable style={pressableStyle} onPress={handlePress}>
      <View style={styles.content}>
        <Ionicons
          name={isCombined ? "shuffle-outline" : "list-circle-outline"}
          size={24}
          color={theme.colors.primary}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    opacity: 0.9,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
