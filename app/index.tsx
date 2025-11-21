// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // For now, always send user to login.
  // Later we'll make this conditional based on auth state.
  // return <Redirect href="/(app)/(tabs)" />;
  return <Redirect href="/(auth)/login" />;
}
