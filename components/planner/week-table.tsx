// components/planner/WeekTable.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { addDays, format } from "date-fns";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { RootState } from "@/api/types";
import { makeSelectWeekGrid } from "@/store/planner-store";
import { theme } from "@/constants/theme/index";
import { MEAL_SLOTS } from "@/constants/planner.const";

interface WeekTableProps {
  anchorWeekStart: Date;
  weekOffset: -1 | 0 | 1;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

const WeekTable: React.FC<WeekTableProps> = ({
  anchorWeekStart,
  weekOffset,
  selectedDate,
  setSelectedDate,
}) => {
  const visibleStart = useMemo(() => {
    const d = new Date(anchorWeekStart);
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [anchorWeekStart, weekOffset]);

  const selectWeekGrid = useMemo(makeSelectWeekGrid, []);
  const grid = useSelector((state: RootState) =>
    selectWeekGrid(state, format(visibleStart, "yyyy-MM-dd"))
  );

  const days = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const date = addDays(visibleStart, i);
        return {
          iso: format(date, "yyyy-MM-dd"),
          labelDay: format(date, "EEE"),
          labelNum: format(date, "dd"),
        };
      }),
    [visibleStart]
  );

  const todayISO = format(new Date(), "yyyy-MM-dd");

  const mealsWithoutSnacks = MEAL_SLOTS.filter((m) => m !== "snacks");

  return (
    <View style={styles.table}>
      {/* Header row */}
      <View style={styles.headerRow}>
        {days.map((day) => {
          const isSelected = selectedDate === day.iso;
          const isToday = day.iso === todayISO;

          return (
            <View
              key={day.iso}
              style={[
                styles.headerCell,
                isSelected && styles.headerCellSelected,
              ]}
            >
              <TouchableOpacity
                onPress={() => setSelectedDate(day.iso)}
                style={styles.headerButton}
              >
                <Text style={styles.headerDay}>{day.labelDay}</Text>
                <View
                  style={[
                    styles.dayCircle,
                    isToday && styles.dayCircleToday,
                  ]}
                >
                  <Text style={styles.dayCircleText}>{day.labelNum}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Body rows */}
      {mealsWithoutSnacks.map((meal) => (
        <View key={meal} style={styles.row}>
          {days.map((day) => {
            const hasMeal = grid[day.iso]?.[meal] ?? false;

            return (
              <View key={day.iso} style={styles.cell}>
                <Ionicons
                  name={hasMeal ? "checkmark" : "remove"}
                  size={16}
                  color={
                    hasMeal
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default WeekTable;

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
  },
  headerCell: {
    flex: 1,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.bgCard,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.bgCard,
    paddingVertical: theme.spacing[2],
  },
  headerCellSelected: {
    backgroundColor: theme.colors.primaryLight,
    borderBottomColor: "transparent",
  },
  headerButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing[1],
  },
  headerDay: {
    color: theme.colors.textPrimary,
    fontSize: 12,
  },
  dayCircle: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: 999,
    width: 37,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleToday: {
    backgroundColor: theme.colors.primary,
  },
  dayCircleText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "300",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.bgCard,
  },
});
