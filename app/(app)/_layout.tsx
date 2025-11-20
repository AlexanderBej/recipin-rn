// app/(app)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function AppLayout() {
  return (
    <Stack>
      {/* Bottom tab navigator lives here */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Screens outside tabs */}
      <Stack.Screen name="recipe/[id]" options={{ title: "Recipe" }} />
      <Stack.Screen name="import" options={{ title: "Import Recipes" }} />
    </Stack>
  );
}
