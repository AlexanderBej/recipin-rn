import { theme } from '@/constants/theme/index';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

export interface SelectOption {
  value: string | number;
  label: string | React.ReactElement;
}

export interface SelectProps {
  label?: string;
  value: string | number | null;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  placeholder?: string;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  onValueChange: (value: string | number) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  required = false,
  error,
  placeholder,
  small = false,
  style,
  onValueChange,
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel =
    selectedOption?.label ??
    placeholder ??
    (label ? `Select ${label}` : 'Select...');

  const hasValue = value !== null && value !== undefined && value !== '';

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <Pressable
        style={[
          styles.row,
          small && styles.rowSmall,
          error && { borderColor: theme.colors.error },
        ]}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[
            styles.valueText,
            !hasValue && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>

        <Ionicons
          name="chevron-down"
          size={18}
          color={theme.colors.textSecondary}
          style={styles.chevron}
        />
      </Pressable>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.modalCard}>
            {label && (
              <Text style={styles.modalTitle}>
                {label}
              </Text>
            )}
            <ScrollView
              style={styles.optionsList}
              keyboardShouldPersistTaps="handled"
            >
              {options.map((opt) => (
                <Pressable
                  key={String(opt.value)}
                  style={({ pressed }) => [
                    styles.optionRow,
                    pressed && styles.optionRowPressed,
                    opt.value === value && styles.optionRowSelected,
                  ]}
                  onPress={() => {
                    onValueChange(opt.value);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      opt.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {typeof opt.label === 'string' || typeof opt.label === 'number'
                      ? opt.label
                      : opt.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[2],
  },
  required: {
    color: theme.colors.error,
  },
  row: {
    position: 'relative',
    backgroundColor: theme.colors.neutral,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.bgMain,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSmall: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  },
  valueText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  placeholderText: {
    color: theme.colors.textSecondary,
  },
  chevron: {
    marginLeft: theme.spacing[2],
  },
  errorText: {
    marginTop: 4,
    fontSize: 10,
    color: theme.colors.error,
  },

  // modal
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
  },
  modalCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[4],
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[3],
  },
  optionsList: {
    maxHeight: '100%',
  },
  optionRow: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    borderRadius: theme.radius.sm,
  },
  optionRowPressed: {
    backgroundColor: theme.colors.bgCardLight,
  },
  optionRowSelected: {
    backgroundColor: theme.colors.primaryDark,
  },
  optionText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
});
