import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library</Text>
      <Button
        title="Go to recipe 123"
        onPress={() => router.push("/(app)/recipe/123")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 16 },
});
