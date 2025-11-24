import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useClipboard } from "@/hooks";
import { buildIngredientText } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme/index";
import { Button } from "../../components/ui";

export default function CopySheet({
  ingredients,
  size = "normal",
}: {
  ingredients: any[];
  size?: "normal" | "small";
}) {
  const [open, setOpen] = useState(false);
  const { copy, copied } = useClipboard();

  const [copiedState, setCopiedState] = useState({
    all: false,
    remaining: false,
  });

  const handleCopyAll = () => {
    copy(buildIngredientText(ingredients, { onlyUnchecked: false }));
    setCopiedState({ all: true, remaining: false });
    setOpen(false);
  };

  const handleCopyRemaining = () => {
    copy(buildIngredientText(ingredients, { onlyUnchecked: true }));
    setCopiedState({ all: false, remaining: true });
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
          <View style={styles.copyRow}>
            <Button
              variant="secondary"
              onPress={handleCopyAll}
              style={{ flex: 1 }}
            >
              {copied && copiedState.all ? (
                <View style={{ position: "absolute", left: 10, top: 10 }}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={theme.colors.success}
                  />
                </View>
              ) : (
                <Text style={{ color: theme.colors.textPrimary }}>
                  Copy All
                </Text>
              )}
            </Button>

            <Button
              variant="primary"
              onPress={handleCopyRemaining}
              style={{ flex: 1 }}
            >
              {copied && copiedState.remaining ? (
                <View style={{ position: "absolute", left: 10, top: 10 }}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={theme.colors.success}
                  />
                </View>
              ) : (
                <Text style={{ color: "#fff" }}>Copy Remaining</Text>
              )}
            </Button>
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  copyRow: {
    flexDirection: "row",
    gap: theme.spacing[2],
    marginBottom: theme.spacing[5],
  },
});
