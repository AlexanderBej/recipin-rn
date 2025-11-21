import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider, useSelector } from "react-redux";

import {
  AppInitializer,
  selectAppBootState,
  selectAuthStatus,
  store,
} from "@/store/index";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { theme } from "../constants/theme/index";

function RootNavigation() {
  const { booting } = useSelector(selectAppBootState);
  const authStatus = useSelector(selectAuthStatus);
  const isAuthed = authStatus === "authenticated";

  if (booting) {
    return (
      <SafeAreaView style={styles.boot}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthed ? (
        <>
          {/* Main tabbed app */}
          <Stack.Screen name="(tabs)" />

          {/* Additional screens above tabs */}
          <Stack.Screen name="create" />
          <Stack.Screen name="recipe/[id]" />
          <Stack.Screen name="import" />
        </>
      ) : (
        <Stack.Screen name="login" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.bgMain }}>
      <View style={styles.background}>
        <Provider store={store}>
          <AppInitializer>
            <BottomSheetModalProvider>
              <RootNavigation />
            </BottomSheetModalProvider>
          </AppInitializer>
        </Provider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    backgroundColor: theme.colors.bgMain, // your global night color
  },
});
