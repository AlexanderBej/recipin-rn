import React, { forwardRef } from "react";
import PagerView from "react-native-pager-view";
import { ScrollView, StyleSheet } from "react-native";
import { CreateRecipeForm } from "@/api";

export interface CreateProps {
  formData: CreateRecipeForm;
  setFormData: React.Dispatch<React.SetStateAction<CreateRecipeForm>>;
}

interface Props {
  children: React.ReactNode[];
  onPageSelected?: (page: number) => void;
}

export type CreatePagerRef = {
  setPage: (index: number) => void;
};

/* eslint-disable react/display-name */
const CreatePager = forwardRef<CreatePagerRef, Props>(
  ({ children, onPageSelected }, ref) => {
    const pagerRef = React.useRef<PagerView>(null);

    React.useImperativeHandle(ref, () => ({
      setPage(index: number) {
        pagerRef.current?.setPage(index);
      },
    }));

    return (
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => onPageSelected?.(e.nativeEvent.position)}
      >
        {children.map((child, idx) => (
          <ScrollView
            key={idx}
            showsVerticalScrollIndicator={false}
            style={styles.page}
          >
            {child}
          </ScrollView>
        ))}
      </PagerView>
    );
  }
);

export default CreatePager;

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    paddingTop: 20,
  },

  page: {
    flex: 1,
  },
});
