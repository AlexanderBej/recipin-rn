import React from "react";
import { Tabs, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { theme } from "@/constants/theme/index";

function RecipinTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const bgCard = theme.colors.bgCard;
  const borderTop = "#2a2a2a";
  const textColor = theme.colors.textPrimary;

  function renderTab(
    routeName: string,
    label: string,
    iconName: IconSymbolName
  ) {
    const index = state.routes.findIndex((r) => r.name === routeName);
    if (index === -1) return null;

    const route = state.routes[index];
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name as never);
      }
    };

    return (
      <View key={route.key} style={styles.navItem}>
        <Pressable
          onPress={onPress}
          style={styles.navLink}
          android_ripple={{ color: "rgba(255,255,255,0.1)", borderless: true }}
        >
          <IconSymbol
            name={iconName}
            size={24}
            color={isFocused ? theme.colors.primary : "rgba(255,255,255,0.6)"}
          />
          <Text
            style={[
              styles.navLabel,
              {
                color: isFocused ? theme.colors.primary : textColor,
                opacity: isFocused ? 1 : 0.6,
              },
            ]}
          >
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: insets.bottom,
          borderTopColor: borderTop,
          backgroundColor: bgCard,
        },
      ]}
    >
      <View style={styles.navItems}>
        {/* Library */}
        {renderTab("index", "Library", "book.fill")}

        {/* Grocery */}
        {renderTab("grocery", "Grocery", "cart.fill")}

        {/* Center FAB */}
        <View style={styles.fabSlot}>
          <View style={styles.fabWrapper}>
            <Pressable
              onPress={() => router.push("/create")}
              style={styles.fabButton}
            >
              <IconSymbol name="plus" size={24} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Planner */}
        {renderTab("planner", "Planner", "calendar")}

        {/* Profile */}
        {renderTab("profile", "Profile", "person.crop.circle")}

        {/* If you later want avatar instead of icon, we can swap Profile’s icon for an Image here */}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: theme.colors.bgCard,
        },
        headerTitleStyle: {
          color: theme.colors.textPrimary
        },
        headerStyle: {
          backgroundColor: theme.colors.bgCard,
        },
        sceneStyle: {
          backgroundColor: theme.colors.bgMain, // <-- THIS IS THE KEY
        },
      }}
      tabBar={(props) => <RecipinTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Library",
        }}
      />
      <Tabs.Screen
        name="grocery"
        options={{
          title: "Grocery",
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: "Planner",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />

      {/* ⚠️ No create tab here — the FAB navigates to /create */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 74,
    borderTopWidth: 1,
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    paddingTop: 5,
  },
  navItems: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  navLink: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
  },
  fabSlot: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  fabWrapper: {
    backgroundColor: theme.colors.bgMain,
    borderRadius: 999,
    padding: 12,
    position: "absolute",
    bottom: -20,
  },
  fabButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff7a00",
  },
});
