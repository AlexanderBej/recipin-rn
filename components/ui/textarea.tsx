import { colors } from '@/constants/theme/colors';
import React, { useState } from 'react';
import {
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';

export interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  containerStyle,
  onFocus,
  onBlur,
  multiline = true,
  numberOfLines = 4,
  ...textInputProps
}) => {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
    ? colors.primary
    : colors.bgCardLight;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.textarea,
          { borderColor },
        ]}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        placeholderTextColor={colors.textSecondary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...textInputProps}
      />

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 14, // 0.875rem
    fontWeight: '500',
    color: colors.textSecondary,
  },
  textarea: {
    paddingVertical: 0.6 * 16, // ~0.6rem
    paddingHorizontal: 0.8 * 16, // ~0.8rem
    borderWidth: 1,
    backgroundColor: colors.neutral,
    color: colors.textPrimary,
    borderRadius: 0.5 * 16, // ~0.5rem
    fontSize: 16,
    minHeight: 100,
    lineHeight: 1.5 * 16,
    // shadow on focus is approximated via borderColor + maybe extra styling if you want
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
  },
});
