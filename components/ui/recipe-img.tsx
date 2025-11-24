import React, { useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ImageStyle,
  ViewStyle,
} from "react-native";

const placeholderImage = require("@/assets/images/logo-bg.png");

type RecipeImageVariant = "card" | "detail" | "thumb" | "square" | "landscape";

interface Props {
  src?: string | null;
  variant?: RecipeImageVariant;
  rounded?: boolean;
  style?: StyleProp<ImageStyle>; // we’ll treat this as container size
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
  console.log("finalSrc", finalSrc);

  const variantAspect: Record<RecipeImageVariant, number> = {
    card: 1.3,
    detail: 1.6,
    thumb: 1.4,
    square: 1,
    landscape: 1.8,
  };

  const containerStyles: StyleProp<ViewStyle> = [
    styles.container,
    rounded && styles.rounded,
    // If the caller passes explicit size, use that;
    // otherwise fall back to aspectRatio-based sizing.
    style,
    !style && { aspectRatio: variantAspect[variant] },
  ];

  return (
    <View style={containerStyles}>
      {loading && (
        <View style={styles.skeleton}>
          <ActivityIndicator size="small" color="#ffffff88" />
        </View>
      )}

      <Image
        source={finalSrc}
        resizeMode="cover"
        style={[styles.image, rounded && styles.rounded]}
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
    backgroundColor: "#2a2a2a",
    overflow: "hidden",
  },
  rounded: {
    borderRadius: 12,
  },
  image: {
    width: "100%",  // <-- always fill container
    height: "100%", // <--
  },
  skeleton: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
});
