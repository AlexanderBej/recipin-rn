import { theme } from "@/constants/theme/index";
import React, { ReactNode } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from "react-native";
import { Spinner } from "./spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "neutral";
export type ButtonShape = "round" | "square";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  shape?: ButtonShape;
  isLoading?: boolean;
  children?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  shape = "square",
  isLoading = false,
  disabled,
  style,
  children,
  ...touchableProps
}) => {
  const isDisabled = disabled || isLoading;

  const variantStyle = getVariantStyle(variant);
  const labelColorStyle = getLabelColorStyle(variant, isDisabled);
  const shapeStyle = getShapeStyle(shape);

  // If children is a string, wrap it in Text so we can style it
  let content: ReactNode;
  if (typeof children === "string" || typeof children === "number") {
    content = <Text style={[styles.label, labelColorStyle]}>{children}</Text>;
  } else {
    content = children;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.base,
        variantStyle,
        shapeStyle,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...touchableProps}
    >
      <View style={styles.content}>
        {isLoading ? <Spinner type="local" /> : content}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing[3], // 12
    paddingHorizontal: theme.spacing[4], // 16
    backgroundColor: theme.colors.neutral,
    borderRadius: theme.radius.sm,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // approximates 0.5rem
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});

// ----- helpers -----

function getVariantStyle(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
      };
    case "secondary":
    case "outline":
      return {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: theme.colors.primary,
      };
    case "danger":
      return {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: theme.colors.error,
        height: 50,
        width: "100%" as const,
        marginTop: 50,
      };
    case "neutral":
      return {
        backgroundColor: "transparent",
        borderWidth: 0,
      };
    default:
      return {};
  }
}

function getLabelColorStyle(variant: ButtonVariant, disabled: boolean) {
  if (disabled) {
    return { color: theme.colors.textSecondary };
  }

  switch (variant) {
    case "primary":
      return { color: theme.colors.textPrimary }; // white
    case "secondary":
    case "outline":
      return { color: theme.colors.primary };
    case "danger":
      return { color: theme.colors.error };
    case "neutral":
      return { color: theme.colors.primaryDark };
    default:
      return { color: theme.colors.textPrimary };
  }
}

function getShapeStyle(shape: ButtonShape) {
  switch (shape) {
    case "round":
      return {
        borderRadius: 999,
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[3],
        minWidth: 40,
        minHeight: 40,
      };
    case "square":
    default:
      return {
        borderRadius: theme.radius.sm,
      };
  }
}
