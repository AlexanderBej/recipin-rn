import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function CardLoading() {
  return (
    <View style={styles.wrapper}>
      {[0, 1].map((i) => (
        <LoadingCard key={i} />
      ))}
    </View>
  );
}

function LoadingCard() {
  // Animation value
  const translateX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 300,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();
  });

  return (
    <View style={styles.card}>
      {/* Image skeleton */}
      <View style={styles.skeletonImage}>
        <Animated.View
          style={[
            styles.shimmerOverlay,
            { transform: [{ translateX }] },
          ]}
        >
          <LinearGradient
            colors={["#1e1e1e00", "#2a2a2a99", "#1e1e1e00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* Content section */}
      <View style={styles.content}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={styles.contentRow}>
            <Animated.View
              style={[
                styles.shimmerOverlay,
                { transform: [{ translateX }] },
              ]}
            >
              <LinearGradient
                colors={["#1e1e1e00", "#2a2a2a99", "#1e1e1e00"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 16,
  },
  card: {
    width: "100%",
    height: 170,
    backgroundColor: "#1e1e1e", // $color-bg-card
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
  },

  // IMAGE SKELETON
  skeletonImage: {
    width: 170,
    height: "100%",
    backgroundColor: "#2a2a2a", // $color-neutral
    overflow: "hidden",
    borderRadius: 12,
  },

  // TEXT CONTENT
  content: {
    padding: 12,
    gap: 14,
    justifyContent: "center",
    flex: 1,
  },
  contentRow: {
    height: 15,
    backgroundColor: "#2a2a2a",
    borderRadius: 5,
    overflow: "hidden",
  },

  // SHIMMER OVERLAY
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: "60%",
  },
});
