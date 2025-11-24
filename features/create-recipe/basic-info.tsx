// features/create-recipe/basic-info/BasicInfo.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

import { Input, Select, Textarea } from "@/components/ui/";
import { theme } from "@/constants/theme/index";
import { CATEGORY_META } from "@/constants/recipes.const";
import { CreateProps } from "./create-pages";
import { CreateRecipeForm } from "@/api";
import { TagSheet } from "../sheets/tag-sheet";

const BasicInfo: React.FC<CreateProps> = ({ formData, setFormData }) => {
  const CATEGORY_OPTIONS = Object.entries(CATEGORY_META).map(([value, meta]) => ({
    value,
    label: meta.label,
  }));

  const DIFFICULTY_OPTIONS = [
    { value: "easy", label: "Easy" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev: CreateRecipeForm) => ({ ...prev, tags }));
  };

  return (
    <View style={styles.container}>
      <Input
        label="Title"
        value={formData.title}
        placeholder="e.g. Garlic Naan"
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, title: text }))
        }
      />

      <Select
        label="Category"
        value={formData.category}
        options={CATEGORY_OPTIONS}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, category: value as any }))
        }
      />

      <Textarea
        label="Description"
        value={formData.description}
        placeholder="Short summary"
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, description: text }))
        }
      />

      <View style={styles.prepRow}>
        <View style={{ flex: 1 }}>
          <Input
            label="Prep Time"
            value={formData.prepMinutes as string | undefined}
            placeholder="35"
            keyboardType="numeric"
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, prepMinutes: Number(text) }))
            }
          />
        </View>

        <View style={{ flex: 1 }}>
          <Input
            label="Cook Minutes"
            value={formData.cookMinutes as string | undefined}
            placeholder="40"
            keyboardType="numeric"
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, cookMinutes: Number(text) }))
            }
          />
        </View>
      </View>

      <Select
        label="Difficulty"
        value={formData.difficulty ?? ""}
        options={DIFFICULTY_OPTIONS}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, difficulty: value as any }))
        }
      />

      <Input
        label="Image URL"
        value={formData.imageURL ?? ""}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, imageURL: text }))
        }
      />

      <TagSheet selected={formData.tags ?? []} onChange={handleTagsChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    gap: theme.spacing[4],
    paddingBottom: 40
  },
  prepRow: {
    flexDirection: "row",
    width: "100%",
    gap: theme.spacing[3],
  } as any,
});

export default BasicInfo;
