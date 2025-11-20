import { theme } from '@/constants/theme/index';
import { displayTag } from '@/utils/formatters.util';
import React from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    ViewStyle,
} from 'react-native';

export interface ChipProps {
  tag: string;
  active?: boolean;
  onToggle: (tag: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const Chip: React.FC<ChipProps> = ({ tag, active = false, onToggle, style }) => {
  return (
    <Pressable
      onPress={() => onToggle(tag)}
      style={({ pressed }) => [
        styles.base,
        active && styles.active,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, active && styles.labelActive]}>
        {displayTag(tag)}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing[2],  // 8
    paddingHorizontal: theme.spacing[3], // 12
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md, // 12
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  active: {
    backgroundColor: theme.colors.primaryDark,
  },
  labelActive: {
    color: theme.colors.textPrimary,
  },
  pressed: {
    opacity: 0.8,
  },
});
