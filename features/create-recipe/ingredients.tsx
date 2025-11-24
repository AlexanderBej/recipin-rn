import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Button, Input, Select } from "@/components/ui/";
import { theme } from "@/constants/theme/";
import { MEASURING_UNITS_ALL } from "@/constants/recipes.const";
import { CreateProps } from "./create-pages";

const Ingredients: React.FC<CreateProps> = ({ formData, setFormData }) => {
  const update = (
    index: number,
    key: "item" | "quantity" | "unit",
    val: string
  ) => {
    const next = [...formData.ingredients];
    next[index] = { ...next[index], [key]: val };
    setFormData({ ...formData, ingredients: next });
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => {
      const next = prev.ingredients.filter((_, i) => i !== index);
      return { ...prev, ingredients: next };
    });
  };

  const UNITS_OPTIONS = MEASURING_UNITS_ALL.map((unit) => ({
    label: unit,
    value: unit,
  }));

  return (
    <View style={styles.wrapper}>
      {formData.ingredients.map((ing, i) => (
        <View key={i} style={styles.ingredientContainer}>
          <View style={styles.ingrRow}>
            <View style={{ flex: 1 }}>
              <Input
                value={ing.item}
                placeholder="Flour"
                onChangeText={(text) => update(i, "item", text)}
              />
            </View>

            <TouchableOpacity
              onPress={() => removeIngredient(i)}
              style={styles.deleteButton}
            >
              <Ionicons
                name="remove-circle"
                size={28}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.ingrRow}>
            <View style={{ flex: 1 }}>
              <Input
                value={ing.quantity ?? ""}
                placeholder="200"
                keyboardType="numeric"
                onChangeText={(text) => update(i, "quantity", text)}
              />
            </View>

            <View style={styles.unitSelect}>
              <Select
                value={ing.unit ?? ""}
                options={UNITS_OPTIONS}
                onValueChange={(val) => update(i, "unit", val as string)}
              />
            </View>
          </View>
        </View>
      ))}

      <Button
        variant="secondary"
        style={{ width: "100%" }}
        onPress={() =>
          setFormData({
            ...formData,
            ingredients: [
              ...formData.ingredients,
              { item: "", quantity: "", unit: "" },
            ],
          })
        }
      >
        + Add ingredient
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  ingredientContainer: {
    marginBottom: theme.spacing[4],
  },
  ingrRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: theme.spacing[3],
  },
  deleteButton: {
    padding: 4,
  },
  unitSelect: {
    minWidth: 150,
  },
});

export default Ingredients;
