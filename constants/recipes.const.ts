import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import {
  RecipeCategory,
  TagCategory,
  RatingCategory,
} from "@/api/types/index";
import { TagDef } from "@/api/models/index";

type CategoryIconProps = {
  size?: number;
  color?: string;
};

type CategoryMeta = {
  label: string;
  color: string;
  icon: (props: CategoryIconProps) => React.ReactElement;
};

export const CATEGORY_META: Record<RecipeCategory, CategoryMeta> = {
  breakfast: {
    label: "Breakfast",
    color: "#FBBF24", // amber-400
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "egg-fried" as any,
        ...props,
      }),
  },
  lunch: {
    label: "Lunch",
    color: "#F59E0B", // amber-500
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "food-fork-drink" as any,
        ...props,
      }),
  },
  dinner: {
    label: "Dinner",
    color: "#F87171", // red-400
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "silverware-fork-knife" as any,
        ...props,
      }),
  },
  snacks: {
    label: "Snacks",
    color: "#FB923C", // orange-400
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "food-apple" as any,
        ...props,
      }),
  },
  appetizers: {
    label: "Appetizers",
    color: "#4ADE80", // green-400
    icon: (props) =>
      React.createElement(Ionicons, {
        name: "leaf-outline" as any,
        ...props,
      }),
  },
  "soups-stews": {
    label: "Soups & Stews",
    color: "#60A5FA", // blue-400
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "pot-steam-outline" as any,
        ...props,
      }),
  },
  salads: {
    label: "Salads",
    color: "#34D399", // emerald-400
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "leaf" as any,
        ...props,
      }),
  },
  sides: {
    label: "Sides",
    color: "#A3E635", // lime-400
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "french-fries" as any,
        ...props,
      }),
  },
  "flatbreads-breads": {
    label: "Flatbreads & Breads",
    color: "#FCD34D",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "bread-slice" as any,
        ...props,
      }),
  },
  "pastries-doughs": {
    label: "Pastries & Doughs",
    color: "#F9A8D4",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "croissant" as any,
        ...props,
      }),
  },
  "pasta-noodles": {
    label: "Pasta & Noodles",
    color: "#F97316",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "noodles" as any,
        ...props,
      }),
  },
  "rice-grains": {
    label: "Rice & Grains",
    color: "#84CC16",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "rice" as any,
        ...props,
      }),
  },
  "meat-dishes": {
    label: "Meat Dishes",
    color: "#F87171",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "food-steak" as any,
        ...props,
      }),
  },
  "seafood-dishes": {
    label: "Seafood Dishes",
    color: "#38BDF8",
    icon: (props) =>
      React.createElement(Ionicons, {
        name: "fish-outline" as any,
        ...props,
      }),
  },
  "vegetarian-mains": {
    label: "Vegetarian Mains",
    color: "#22C55E",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "carrot" as any,
        ...props,
      }),
  },
  "vegan-mains": {
    label: "Vegan Mains",
    color: "#16A34A",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "sprout" as any,
        ...props,
      }),
  },
  desserts: {
    label: "Desserts",
    color: "#F472B6",
    icon: (props) =>
      React.createElement(Ionicons, {
        name: "ice-cream-outline" as any,
        ...props,
      }),
  },
  "cakes-muffins": {
    label: "Cakes & Muffins",
    color: "#FB7185",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "cake-variant-outline" as any,
        ...props,
      }),
  },
  "cookies-bars": {
    label: "Cookies & Bars",
    color: "#FDBA74",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "cookie-outline" as any,
        ...props,
      }),
  },
  "drinks-smoothies": {
    label: "Drinks & Smoothies",
    color: "#60A5FA",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "glass-cocktail" as any,
        ...props,
      }),
  },
  "sauces-condiments": {
    label: "Sauces & Condiments",
    color: "#FBBF24",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "bottle-soda-outline" as any,
        ...props,
      }),
  },
  "spice-mixes-marinades": {
    label: "Spice Mixes & Marinades",
    color: "#FACC15",
    icon: (props) =>
      React.createElement(MaterialCommunityIcons, {
        name: "chili-mild" as any,
        ...props,
      }),
  },
};

export const TAGS: Record<TagCategory, TagDef[]> = {
  cuisine: [
    { id: "indian", label: "Indian" },
    { id: "italian", label: "Italian" },
    { id: "middle-eastern", label: "Middle Eastern" },
    { id: "mexican", label: "Mexican" },
    { id: "thai", label: "Thai" },
    { id: "asian", label: "Asian" },
    { id: "japanese", label: "Japanese" },
    { id: "greek", label: "Greek" },
    { id: "french", label: "French" },
    { id: "american", label: "American" },
    { id: "korean", label: "Korean" },
    { id: "spanish", label: "Spanish" },
    { id: "mediterranean", label: "Mediterranean" },
    { id: "romanian", label: "Romanian" },
    { id: "cuban", label: "Cuban" },
    { id: "russian", label: "Russian" },
    { id: "indonesian", label: "Indonesian" },
    { id: "north-african", label: "North African" },
  ],
  dietary: [
    { id: "vegan", label: "Vegan" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "gluten-free", label: "Gluten Free" },
    { id: "dairy-free", label: "Dairy Free" },
    { id: "keto", label: "Keto" },
    { id: "salad", label: "Salad" },
    { id: "low-carb", label: "Low Carb" },
    { id: "paleo", label: "Paleo" },
    { id: "nut-free", label: "Nut Free" },
    { id: "protein", label: "Protein" },
  ],
  method: [
    { id: "baked", label: "Baked" },
    { id: "fried", label: "Fried" },
    { id: "grilled", label: "Grilled" },
    { id: "steamed", label: "Steamed" },
    { id: "raw", label: "Raw" },
    { id: "roasted", label: "Roasted" },
    { id: "air-fryer", label: "Air Fryer" },
    { id: "slow-cooker", label: "Slow Cooker" },
    { id: "home-made", label: "Home Made" },
  ],
  occasion: [
    { id: "breakfast", label: "Breakfast" },
    { id: "brunch", label: "Brunch" },
    { id: "lunch", label: "Lunch" },
    { id: "quick-meal", label: "Quick Meal" },
    { id: "comfort-food", label: "Comfort Food" },
    { id: "dinner", label: "Dinner" },
    { id: "dinner-party", label: "Dinner Party" },
    { id: "holiday", label: "Holiday" },
    { id: "meal-prep", label: "Meal Prep" },
    { id: "kids-friendly", label: "Kids Friendly" },
  ],
  time: [
    { id: "15-minute", label: "15 Minute" },
    { id: "30-minute", label: "30 Minute" },
    { id: "1-hour", label: "1 Hour" },
    { id: "one-pot", label: "One Pot" },
  ],

  specific: [
    { id: "coconut", label: "Coconut" },
    { id: "tostones", label: "Tostones" },
    { id: "potatoes", label: "Potatoes" },
    { id: "garlic", label: "Garlic" },
  ],
};

export const MAIN_TAGS = ["Italian", "Low-Carb", "30-Minute", "Air Fryer"];

export const MEASURING_UNITS = {
  volume: ["mL", "L", "tsp", "tbsp", "fl oz", "cup", "pint", "quart", "gallon"],
  weight: ["g", "kg", "oz", "lb"],
  count: ["piece", "slice", "clove", "leaf", "pinch", "dash"],
  temperature: ["°C", "°F"],
} as const;

export const MEASURING_UNITS_ALL = [
  "mL",
  "L",
  "tsp",
  "tbsp",
  "fl oz",
  "cup",
  "pint",
  "quart",
  "gallon",
  "g",
  "kg",
  "oz",
  "lb",
  "piece",
  "slice",
  "clove",
  "leaf",
  "pinch",
  "dash",
];

export const RATING_CATEGORIES: RatingCategory[] = [
  "taste",
  "ease",
  "health",
  "presentation",
  "value",
];
export const MAX_PER_CATEGORY = 5;
export const MAX_TOTAL = RATING_CATEGORIES.length * MAX_PER_CATEGORY;
