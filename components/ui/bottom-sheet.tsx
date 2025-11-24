import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "@/constants/theme/index";
import { Ionicons } from "@expo/vector-icons";

type SheetSize = "auto" | "tall" | "fullscreen";

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  showHandle?: boolean;
  showClose?: boolean;
  size?: SheetSize;
  nonDismissable?: boolean;
  children?: ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  title,
  headerActions,
  footer,
  showHandle = true,
  showClose = true,
  size = "auto",
  nonDismissable = false,
  children,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => {
    switch (size) {
      case "fullscreen":
        return [500, 800];
      case "tall":
        return [600, 750];
      case "auto":
      default:
        return [400];
    }
  }, [size]);

  // Sync controlled `open` with the BottomSheetModal
  useEffect(() => {
    if (open) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [open]);

  const handleDismiss = () => {
    onOpenChange(false);
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      enablePanDownToClose={!nonDismissable}
      handleComponent={showHandle ? undefined : () => null}
      backgroundStyle={{
        backgroundColor: theme.colors.bgCard,
        borderRadius: theme.radius.lg,
      }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.bgCardLight }}
    >
      <View style={styles.container}>
        {(title || headerActions || showClose) && (
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {typeof title === "string" ? (
                <Text style={styles.title}>{title}</Text>
              ) : (
                title
              )}
            </View>

            <View style={styles.headerRight}>
              {headerActions}
              {showClose && !nonDismissable && (
                <Ionicons
                  name="close"
                  size={20}
                  color={theme.colors.textSecondary}
                  onPress={() => onOpenChange(false)}
                />
              )}
            </View>
          </View>
        )}

        <BottomSheetScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
        >
          {children}
        </BottomSheetScrollView>

        {footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  footer: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.bgCardLight,
  },
});
