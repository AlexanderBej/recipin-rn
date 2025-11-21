import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {BottomSheet} from "@/components/ui/bottom-sheet";
import { useClipboard } from "@/hooks";
import { buildIngredientText } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme/index";

export default function CopySheet({
  ingredients,
  size = "normal",
}: {
  ingredients: any[];
  size?: "normal" | "small";
}) {
  const [open, setOpen] = useState(false);
  const { copy, copied } = useClipboard();

  const handleCopyAll = () => {
    copy(buildIngredientText(ingredients, { onlyUnchecked: false }));
    setOpen(false);
  };

  const handleCopyRemaining = () => {
    copy(buildIngredientText(ingredients, { onlyUnchecked: true }));
    setOpen(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Ionicons
          name="chevron-down"
          size={size === "small" ? 18 : 22}
          color={theme.colors.textPrimary}
        />
      </TouchableOpacity>

      <BottomSheet open={open} onOpenChange={setOpen} title="Copy options">
        <View style={{ padding: theme.spacing[4], gap: theme.spacing[4] }}>
          <TouchableOpacity onPress={handleCopyAll}>
            <Text style={{ fontSize: 16 }}>Copy all</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCopyRemaining}>
            <Text style={{ fontSize: 16 }}>Copy remaining</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
}
