import React, { ReactNode, useEffect } from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme/index";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  // Disable hardware back button on Android if needed
  useEffect(() => {
    // Optional: add BackHandler logic here if you want
  }, [isOpen]);

  return (
    <RNModal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Dimmed overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Actual modal card */}
      <View style={styles.centerContainer}>
        <View style={styles.card}>
          {/* HEADER */}
          <View style={styles.header}>
            {title ? <Text style={styles.title}>{title}</Text> : <View />}

            <TouchableOpacity onPress={onClose} hitSlop={15}>
              <Ionicons
                name="close"
                size={22}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* CONTENT */}
          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    paddingTop: theme.spacing[3],
    overflow: "hidden",
    maxHeight: "85%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  header: {
    paddingHorizontal: theme.spacing[3],
    paddingBottom: theme.spacing[2],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },

  body: {
    paddingHorizontal: theme.spacing[3],
    paddingBottom: theme.spacing[4],
  },
});
