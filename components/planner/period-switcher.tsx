// components/planner/PeriodSwitcher.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "@/constants/theme/index";

interface PeriodSwitcherProps {
  anchorWeekStart: Date;
  weekOffset: -1 | 0 | 1;
  setWeekOffset: React.Dispatch<React.SetStateAction<-1 | 0 | 1>>;
}

const PeriodSwitcher: React.FC<PeriodSwitcherProps> = ({
  anchorWeekStart,
  weekOffset,
  setWeekOffset,
}) => {
  const visibleStart = useMemo(() => {
    const d = new Date(anchorWeekStart);
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [anchorWeekStart, weekOffset]);

  const getEndOfWeek = (date: Date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 6);
    return d;
  };

  const label =
    weekOffset === -1 ? "Last week" : weekOffset === 0 ? "Current week" : "Next week";

  const canGoBack = weekOffset > -1;
  const canGoForward = weekOffset < 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={!canGoBack}
        onPress={() =>
          setWeekOffset((o) => (o > -1 ? ((o - 1) as -1 | 0 | 1) : o))
        }
        style={styles.toggler}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={canGoBack ? theme.colors.primary : theme.colors.textSecondary}
        />
      </TouchableOpacity>

      <View style={styles.weekRange}>
        <Text style={styles.weekText}>{label}</Text>
        <Text style={styles.weekDates}>
          {format(visibleStart, "MMM do")} – {format(getEndOfWeek(visibleStart), "MMM do")}
        </Text>
      </View>

      <TouchableOpacity
        disabled={!canGoForward}
        onPress={() =>
          setWeekOffset((o) => (o < 1 ? ((o + 1) as -1 | 0 | 1) : o))
        }
        style={styles.toggler}
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color={canGoForward ? theme.colors.primary : theme.colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PeriodSwitcher;

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[2],
    alignSelf: "center",
  },
  toggler: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  weekRange: {
    width: 200,
    height: "100%",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  weekText: {
    position: "absolute",
    top: 4,
    fontSize: 9,
    fontWeight: "400",
    color: theme.colors.primary,
  },
  weekDates: {
    color: theme.colors.textPrimary,
    fontSize: 13,
  },
});
