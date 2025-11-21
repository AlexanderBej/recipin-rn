import React, { useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ImageStyle,
} from "react-native";

const placeholderImage = require("@/assets/images/img_placeholder.png");

type RecipeImageVariant =
  | "card"
  | "detail"
  | "thumb"
  | "square"
  | "landscape";

interface Props {
  src?: string | null;
  variant?: RecipeImageVariant;
  rounded?: boolean;
  style?: StyleProp<ImageStyle>;
}

export default function RecipeImg({
  src,
  variant = "card",
  rounded = true,
  style,
}: Props) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  const finalSrc = failed || !src ? placeholderImage : { uri: src };

  // Aspect ratios based on your original variants
  const variantAspect: Record<RecipeImageVariant, number> = {
    card: 1.3,
    detail: 1.6,
    thumb: 1.4,
    square: 1,
    landscape: 1.8,
  };

  return (
    <View
      style={[
        styles.container,
        rounded && styles.rounded,
        { aspectRatio: variantAspect[variant] },
      ]}
    >
      {loading && (
        <View style={styles.skeleton}>
          <ActivityIndicator size="small" color="#ffffff88" />
        </View>
      )}

      <Image
        source={finalSrc}
        resizeMode="cover"
        style={[
          StyleSheet.absoluteFill,
          styles.image,
          rounded && styles.rounded,
          style, // <- ImageStyles only
        ]}
        onError={() => {
          setFailed(true);
          setLoading(false);
        }}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: "100%",
    backgroundColor: "#2a2a2a", // neutral background while loading
    overflow: "hidden",
  },
  rounded: {
    borderRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
});
