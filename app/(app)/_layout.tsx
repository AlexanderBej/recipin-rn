// app/(app)/_layout.tsx
import { theme } from "@/constants/theme/index";
import { Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  return (
    <Stack screenOptions={{contentStyle: {backgroundColor: theme.colors.bgMain}, headerStyle: {backgroundColor: theme.colors.bgCard}}}>
      {/* Bottom tab navigator lives here */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Screens outside tabs */}
      <Stack.Screen name="recipe/[id]" options={{ title: "Recipe" }} />
      <Stack.Screen name="import" options={{ title: "Import Recipes" }} />
    </Stack>
  );
}
