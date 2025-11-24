import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/constants/theme/";
import { TagCategory, TagDef } from "@/api";
import { TAGS } from "@/constants/recipes.const";
import { displayTag } from "@/utils";
import { BottomSheet, Chip } from "../../components/ui";

interface TagSheetProps {
  selected: string[];
  onChange: (next: string[]) => void;
  categories?: TagCategory[];
  closeOnOne?: boolean;
}

export const TagSheet: React.FC<TagSheetProps> = ({
  selected,
  onChange,
  categories,
  closeOnOne = false,
}) => {
  const [open, setOpen] = useState(false);

  const cats: TagCategory[] =
    categories ?? (Object.keys(TAGS) as TagCategory[]);

  const isSelected = useCallback(
    (tag: string) => selected.includes(tag),
    [selected]
  );

  const toggle = useCallback(
    (tag: string) => {
      const next = isSelected(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag];

      onChange(next);
      if (closeOnOne) setOpen(false);
    },
    [selected, onChange, closeOnOne, isSelected]
  );

  const labelToCamelCase = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  return (
    <View style={styles.wrapper}>
      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Tags</Text>

        <TouchableOpacity onPress={() => setOpen(true)}>
          <Ionicons
            name="chevron-down"
            size={14}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Selected tags */}
      {selected.length > 0 && (
        <View style={styles.selectedList}>
          {selected.map((tag, index) => {
            const active = isSelected(tag);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => toggle(tag)}
                style={[
                  styles.selectedChip,
                  active && styles.selectedChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.selectedChipText,
                    active && styles.selectedChipTextActive,
                  ]}
                >
                  {displayTag(tag)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Bottom sheet: full tag list */}
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="All tags"
        size="tall"
        showHandle
      >
        <View>
          {cats.map((category) => {
            const tags: readonly TagDef[] = TAGS[category];
            if (!tags || tags.length === 0) return null;

            return (
              <View key={category} style={styles.categoryBox}>
                <Text style={styles.categoryLabel}>
                  {labelToCamelCase(category)}
                </Text>

                <View style={styles.tagList}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      tag={tag.id}
                      active={isSelected(tag.id)}
                      onToggle={toggle}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[3],
  },
  headerLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  /* Selected chips */
  selectedList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
  },
  selectedChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bgCard,
  },
  selectedChipActive: {
    backgroundColor: theme.colors.primary,
  },
  selectedChipText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
  },
  selectedChipTextActive: {
    color: "white",
  },

  /* Sheet categories */
  categoryBox: {
    width: "100%",
    marginBottom: theme.spacing[3],
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: theme.spacing[2],
    color: theme.colors.textPrimary,
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[2],
  },
});
