import { colors } from '@/constants/theme/colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export type SpinnerType = 'local' | 'fullscreen';

interface SpinnerProps {
  type?: SpinnerType;
}

export const Spinner: React.FC<SpinnerProps> = ({ type = 'local' }) => {
  if (type === 'fullscreen') {
    return (
      <View style={styles.fullscreen}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <ActivityIndicator size="small" color={colors.primary} />;
};

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
