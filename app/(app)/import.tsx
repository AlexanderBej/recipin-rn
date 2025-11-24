// src/screens/import/ImportScreen.tsx

import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";

import { selectAuthUserId } from "@/store/auth-store";
import { addRecipePair } from "@/api/services";
import { CreateRecipeInput } from "@/api/types";
import { theme } from "@/constants/theme/";
// If you already have a RN Button component:
import { Button } from "@/components/ui"; // adjust path if needed

export const ImportScreen: React.FC = () => {
  const [raw, setRaw] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const uid = useSelector(selectAuthUserId);

  const parse = (): any[] => {
    if (!raw.trim()) return [];
    try {
      // try JSON array
      const j = JSON.parse(raw);
      return Array.isArray(j) ? j : [j];
    } catch {
      // try JSON Lines
      return raw
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => JSON.parse(l));
    }
  };

  const onImport = async () => {
    if (!uid) {
      setLog((l) => [...l, "Sign in first."]);
      return;
    }

    let rawItems: any[] = [];

    try {
      rawItems = parse();
    } catch (e: any) {
      setLog((l) => [
        ...l,
        `Error parsing JSON: ${e?.message ?? String(e)}`,
      ]);
      return;
    }

    if (!rawItems.length) {
      setLog((l) => [...l, "Nothing to import."]);
      return;
    }

    const items: CreateRecipeInput[] = rawItems.map((r: any) => ({
      ...r,
      authorId: uid,
      tags: r.tags ?? [],
      difficulty: r.difficulty ?? null,
      imageUrl: r.imageUrl ?? null,
      isPublic: r.isPublic ?? false,
    }));

    let success = 0;
    let failure = 0;

    for (const data of items) {
      try {
        await addRecipePair(data);
        success++;
      } catch (e: any) {
        console.error("Import error for recipe:", data.title, e);
        failure++;
        setLog((l) => [
          ...l,
          `Error importing "${data.title ?? "Untitled"}": ${
            e?.message ?? String(e)
          }`,
        ]);
      }
    }

    setLog((l) => [
      ...l,
      `Import finished. Success: ${success}, Failed: ${failure}.`,
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Import recipes</Text>
      <Text style={styles.subtitle}>
        Paste JSON array or JSON Lines (one recipe per line).
      </Text>

      <TextInput
        value={raw}
        onChangeText={setRaw}
        placeholder='[ { "title": "...", ... }, ... ]'
        multiline
        textAlignVertical="top"
        style={styles.textarea}
        autoCorrect={false}
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          // if your Button expects a different API, adjust here
          onPress={onImport}
          style={styles.importButton}
        >
          Import
        </Button>
      </View>

      {log && log.length > 0 ? (
        <View style={styles.logBox}>
          <Text style={styles.logText}>{log.join("\n")}</Text>
        </View>
      ) : (
        <Text style={styles.logTextMuted}>
          Import and see what happens
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[6],
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[3],
  },
  textarea: {
    width: "100%",
    height: 550,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.bgCardLight,
    padding: theme.spacing[3],
    fontFamily: "monospace",
    fontSize: 13,
    backgroundColor: theme.colors.bgCard,
  },
  buttonContainer: {
    marginTop: theme.spacing[5],
  },
  importButton: {
    width: "100%",
  },
  logBox: {
    marginTop: theme.spacing[3],
  },
  logText: {
    // whiteSpace: "pre-wrap", // RN ignores this but keeps intent clear
    fontFamily: "monospace",
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  logTextMuted: {
    marginTop: theme.spacing[3],
    fontFamily: "monospace",
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});

export default ImportScreen;
