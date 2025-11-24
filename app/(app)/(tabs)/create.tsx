import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { theme } from "@/constants/theme/index";
import {
  CreatePagerRef,
  BasicInfo,
  Ingredients,
  Steps,
  MediaReview,
  CreatePager,
} from "@/features";

import { selectAuthUserId } from "@/store/auth-store";
import { createRecipe } from "@/store/recipes-store";
import { CreateRecipeInput, CreateRecipeForm } from "@/api";
import { useAppDispatch } from "@/store";

export default function CreateScreen() {
  const dispatch = useAppDispatch();
  const userId = useSelector(selectAuthUserId);

  const pagerRef = useRef<CreatePagerRef>(null);

  const [formData, setFormData] = useState<CreateRecipeForm>({
    title: "",
    category: "appetizers",
    ingredients: [{ item: "", unit: "" }],
    steps: [""],
  });

  const [step, setStep] = useState(0);

  const pages = useMemo(
    () => [
      <BasicInfo key="basic" formData={formData} setFormData={setFormData} />,
      <Ingredients
        key="ingredients"
        formData={formData}
        setFormData={setFormData}
      />,
      <Steps key="steps" formData={formData} setFormData={setFormData} />,
      <MediaReview
        key="review"
        formData={formData}
        setFormData={setFormData}
      />,
    ],
    [formData]
  );

  const goTo = (index: number) => {
    pagerRef.current?.setPage(index);
    setStep(index);
  };

  const handleSubmit = async () => {
    if (!userId) return;

    const payload: CreateRecipeInput = {
      ...formData,
      authorId: userId,
    };

    await dispatch(createRecipe(payload)).unwrap();
  };

  return (
    <View style={styles.screen}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {["Basic Info", "Ingredients", "Steps", "Review"].map((label, i) => (
          <Text
            key={i}
            style={[styles.tab, i === step && styles.activeTab]}
            onPress={() => goTo(i)}
          >
            {label}
          </Text>
        ))}
      </View>

      {/* Pager */}
      <CreatePager ref={pagerRef} onPageSelected={(page) => setStep(page)}>
        {pages}
      </CreatePager>

      {/* Footer actions */}
      <View style={styles.footer}>
        <Button
          variant="secondary"
          disabled={step === 0}
          onPress={() => goTo(step - 1)}
        >
          Back
        </Button>

        {step < pages.length - 1 ? (
          <Button onPress={() => goTo(step + 1)}>Next</Button>
        ) : (
          <Button onPress={handleSubmit}>Save Recipe</Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: theme.spacing[4],
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing[3],
  },
  tab: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  activeTab: {
    color: theme.colors.primary,
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    paddingBottom: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing[3],
    marginTop: theme.spacing[4],
  },
});
