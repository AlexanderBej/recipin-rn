import { theme } from '@/constants/theme/index';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface StarRatingProps {
  value: number; // current selected rating
  onChange?: (next: number) => void;
  showValue?: boolean;
  small?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  showValue = false,
  small = false,
}) => {
  const iconSize = small ? 18 : 24;

  return (
    <View style={styles.wrapper}>
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }).map((_, i) => {
          const n = i + 1;
          const filled = n <= value;

          return (
            <Pressable
              key={n}
              onPress={() => onChange?.(n)}
              hitSlop={8}
              style={({ pressed }) => [
                styles.starButton,
                pressed && styles.starPressed,
              ]}
            >
              <Ionicons
                name={filled ? 'star' : 'star-outline'}
                size={iconSize}
                color={theme.colors.primary}
              />
            </Pressable>
          );
        })}
      </View>

      {showValue && <Text style={styles.valueText}>{value}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3], // works in latest Expo
    width: '100%',
  },
  starsRow: {
    flexDirection: 'row',
    gap: theme.spacing[1],
  },
  starButton: {
    padding: 4,
  },
  starPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
  valueText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
});
