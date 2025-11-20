import { theme } from '@/constants/theme/index';
import React, { ReactNode, useCallback } from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

export interface CheckboxProps {
  label?: ReactNode;
  value: boolean;
  onValueChange?: (next: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  const handlePress = useCallback(() => {
    if (disabled) return;
    onValueChange?.(!value);
  }, [disabled, onValueChange, value]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        style,
        disabled && styles.containerDisabled,
        pressed && !disabled && styles.containerPressed,
      ]}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}
    >
      <View
        style={[
          styles.box,
          value && styles.boxChecked,
          disabled && styles.boxDisabled,
        ]}
      >
        {value && <Text style={styles.checkIcon}>✓</Text>}
      </View>

      {label != null && (
        <Text
          style={[styles.label, disabled && styles.labelDisabled]}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const CHECKBOX_SIZE = 22;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap doesn't fully exist everywhere yet; use margin on label instead
  },
  containerPressed: {
    opacity: 0.8,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  box: {
    width: CHECKBOX_SIZE,
    height: CHECKBOX_SIZE,
    borderRadius: 999, // pill/circle
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)', // --checkbox-border-unchecked
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  boxChecked: {
    borderColor: theme.colors.primary, // --checkbox-border-checked
    backgroundColor: 'rgba(255, 122, 0, 0.16)', // --checkbox-bg-checked
  },
  boxDisabled: {
    opacity: 0.4,
  },
  checkIcon: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  label: {
    marginLeft: theme.spacing[3], // gap: $spacing-3
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  labelDisabled: {
    opacity: 0.4,
  },
});
