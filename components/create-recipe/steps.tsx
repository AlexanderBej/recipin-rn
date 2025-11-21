import React from "react";
import { View, StyleSheet } from "react-native";

import { Button, Textarea } from "@/components/ui/";
import { CreateProps } from "./create-pages";

const Steps: React.FC<CreateProps> = ({ formData, setFormData }) => {
  const update = (index: number, val: string) => {
    const next = [...formData.steps];
    next[index] = val;
    setFormData({ ...formData, steps: next });
  };

  return (
    <View style={styles.container}>
      {formData.steps.map((s, i) => (
        <View key={i} style={styles.stepWrapper}>
          <Textarea
            value={s}
            placeholder={`Step ${i + 1}`}
            onChangeText={(text) => update(i, text)}
          />
        </View>
      ))}

      <Button
        variant="secondary"
        style={{ width: "100%" }}
        onPress={() =>
          setFormData({ ...formData, steps: [...formData.steps, ""] })
        }
      >
        + Add step
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  stepWrapper: {
    marginBottom: 12,
  },
});

export default Steps;
