import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { theme } from "@/constants/theme/";
import { CreateProps } from "./create-pages";

const MediaReview: React.FC<CreateProps> = ({ formData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.previewLabel}>Preview</Text>
        <Text style={styles.title}>
          {formData.title || "Untitled recipe"}
        </Text>

        {formData.description ? (
          <Text style={styles.description}>{formData.description}</Text>
        ) : null}

        {formData.category ? (
          <Text style={styles.category}>{formData.category}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.bgCardLight,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.bgCard,
  },
  previewLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  title: {
    marginTop: theme.spacing[1],
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  description: {
    marginTop: theme.spacing[1],
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  category: {
    marginTop: theme.spacing[2],
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: theme.colors.textSecondary,
  },
});

export default MediaReview;
