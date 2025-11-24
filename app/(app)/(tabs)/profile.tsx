// src/screens/profile/ProfileScreen.tsx

import React from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { selectAuthUser } from "@/store";
import { theme } from "@/constants/theme/";

const AVATAR_SIZE = 150;

export const ProfileScreen: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const navigation = useNavigation<any>(); // type to your navigator if you have one

  const handleImportPress = () => {
    // Make sure this matches your navigator route name
    navigation.navigate("Import");
  };

  return (
    <View style={styles.container}>
      {user?.photoURL ? (
        <Image
          source={{ uri: user.photoURL }}
          style={styles.avatar}
        />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarPlaceholderText}>
            {user?.displayName?.[0] ?? "?"}
          </Text>
        </View>
      )}

      <Text style={styles.name}>{user?.displayName}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.importCard}
          activeOpacity={0.8}
          onPress={handleImportPress}
        >
          <Text style={styles.importText}>Bulk Import</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: theme.spacing[8],
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.bgCardLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 48,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  name: {
    marginTop: theme.spacing[3],
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  actions: {
    marginTop: theme.spacing[5],
    width: "100%",
    paddingHorizontal: theme.spacing[4],
  },
  importCard: {
    width: "100%",
    height: 65,
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  importText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ProfileScreen;
