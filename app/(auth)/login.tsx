// app/(auth)/login.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";

import { theme } from "@/constants/theme/index";
import { useGoogleLogin } from "@/hooks";
import { selectAuthStatus } from "@/store/index";

const logo = require("@/assets/images/logo.png");

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const userStatus = useSelector(selectAuthStatus);

  // Redirect when logged in
  useEffect(() => {
    if (userStatus === "authenticated") {
      router.replace("/(app)/(tabs)");
    }
  }, [userStatus, router]);

  // const logGoogleUser = async () => {
  //   try {
  //     const user = await signInWithGoogle();
  //     if (user) {
  //       await ensureUserProfile(user);
  //     }
  //   } catch (e) {
  //     console.log('Google sign-in error', e);
  //   }
  // };

  const { signIn } = useGoogleLogin();

  const logGoogleUser = async () => {
    try {
      await signIn();
    } catch (e) {
      console.log("Google sign-in error", e);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={logo}
            resizeMode="cover"
            style={[StyleSheet.absoluteFillObject]}
          />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>
          <View style={styles.divider} />

          <View style={styles.btnRow}>
            <Button
              variant="primary"
              style={styles.loginBtn}
              onPress={() => logGoogleUser()}
            >
              <>
                <Ionicons
                  name="logo-google"
                  size={24}
                  color={theme.colors.textPrimary}
                  style={{ marginRight: theme.spacing[3] }}
                />
                <Text style={styles.btnLabel}>Login with Google</Text>
              </>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bgMain,
  },
  root: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: theme.colors.bgMain,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  // If you have a real logo image:
  // logo: {
  //   width: 180,
  //   height: 180,
  //   resizeMode: 'contain',
  // },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  card: {
    width: 330,
    padding: 20,
    marginTop: 50,
    height: 300,
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[2],
  },
  divider: {
    height: 1,
    alignSelf: "stretch",
    backgroundColor: theme.colors.bgCardLight,
    marginBottom: theme.spacing[4],
  },
  btnRow: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  loginBtn: {
    width: "100%",
    marginTop: 40,
  },
  btnLabel: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
});
