import { theme } from '@/constants/theme/index';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';

export type InputPrefix = 'none' | 'search';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: InputPrefix;
  handleReset?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  prefix = 'none',
  handleReset,
  containerStyle,
  editable = true,
  ...textInputProps
}) => {
  const [focused, setFocused] = useState(false);

  const showPrefix = prefix !== 'none';
  const showReset = !!handleReset;

  const borderColor = error
    ? theme.colors.error
    : focused
    ? theme.colors.primary
    : theme.colors.bgCardLight;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.row,
          {
            borderColor,
            shadowOpacity: focused ? 0.2 : 0,
          },
          !editable && styles.disabledRow,
        ]}
      >
        {showPrefix && (
          <View style={styles.prefix}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.textSecondary}
            />
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            showPrefix && styles.inputWithPrefix,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={(e) => {
            setFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            textInputProps.onBlur?.(e);
          }}
          editable={editable}
          {...textInputProps}
        />

        {showReset && (
          <Pressable
            style={styles.suffix}
            onPress={handleReset}
            hitSlop={8}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'column',
    gap: theme.spacing[2], // RN has partial gap support; safe in latest Expo
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    // paddingHorizontal: theme.spacing[4],
    // paddingVertical: theme.spacing[3],
    padding: theme.spacing[4],
    // shadow for focus state
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
  },
  disabledRow: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    // paddingVertical: theme.spacing[3],
    color: theme.colors.textPrimary,
    fontSize: 16,
    marginLeft: theme.spacing[2]
  },
  inputWithPrefix: {
    marginLeft: theme.spacing[2],
  },
  prefix: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffix: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing[2],
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.error,
  },
});
