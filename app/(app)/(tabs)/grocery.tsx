import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function GroceryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 24, fontWeight: '600' },
});
