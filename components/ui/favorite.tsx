import React from 'react';

import { theme } from '@/constants/theme/index';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

export interface FavoriteProps {
  isFavorite: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  onToggle?: () => void;
}

export const Favorite: React.FC<FavoriteProps> = ({
  isFavorite,
  small = true,
  onToggle,
  style,
}) => {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={10}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && { opacity: 0.7 },
      ]}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={small ? 24 : 32}
        color={theme.colors.error}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: theme.spacing[2],
    right: theme.spacing[2],
    zIndex: 10,
  },
});
