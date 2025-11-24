// app/components/filters/FilterSheet.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { TagDef, RecipeCardFilters } from '@/api/models/index';
import { RECIPE_CATEGORIES, TagCategory } from '@/api/types/index';
import { TAGS } from '@/constants/recipes.const';
import { theme } from '../../constants/theme/index';
import { BottomSheet } from '../../components/ui/bottom-sheet';
import { Button } from '../../components/ui/button';
import { Chip } from '../../components/ui/chip';



interface FilterSheetProps {
  selected: Omit<RecipeCardFilters, 'searchTerm'>;
  onChange: (next: Omit<RecipeCardFilters, 'searchTerm'>) => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Omit<RecipeCardFilters, 'searchTerm'>>(selected);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    tag: false,
    category: false,
  });

  const cats: TagCategory[] = Object.keys(TAGS) as TagCategory[];
  const DIFFICULTIES = ['easy', 'intermediate', 'advanced'];

  useEffect(() => {
    if (open) setFilters(selected);
  }, [open, selected]);

  const toggleFilter = (key: 'category' | 'difficulty' | 'tag', val: string) => {
    setFilters((prev) => {
      const current = prev[key];
      if (current === val) {
        return { ...prev, [key]: undefined };
      }
      return { ...prev, [key]: val as any };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      category: undefined,
      difficulty: undefined,
      tag: undefined,
    });
  };

  const handleApplyFilters = () => {
    onChange(filters);
    setOpen(false);
  };

  const hasChanges =
    filters.category !== selected.category ||
    filters.difficulty !== selected.difficulty ||
    filters.tag !== selected.tag;

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="neutral"
        shape="round"
        onPress={() => setOpen(true)}
        style={{ padding: theme.spacing[2] }}
      >
        <Ionicons
          name="filter"
          size={20}
          color={
            selected.category || selected.difficulty || selected.tag
              ? theme.colors.primary
              : theme.colors.textPrimary
          }
        />
      </Button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        size="fullscreen"
        showHandle
        title={
          filters.category || filters.difficulty || filters.tag ? (
            <Button
              variant="neutral"
              onPress={handleClearFilters}
              style={{ alignSelf: 'flex-start' }}
            >
              Clear filters
            </Button>
          ) : (
            'Filters'
          )
        }
        footer={
          <Button
            variant="primary"
            onPress={handleApplyFilters}
            disabled={!hasChanges}
            style={{ width: '100%' }}
          >
            Apply filters
          </Button>
        }
      >
        {/* body */}
        <View style={{ gap: theme.spacing[4] }}>
          <View>
            <Text style={{ color: theme.colors.textPrimary, marginBottom: theme.spacing[2] }}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
              {RECIPE_CATEGORIES.map((category, index) => {
                const active = filters.category === category;
                if (index > 6 && !expanded.category) return null;
                return (
                  <Chip
                    key={category}
                    tag={category}
                    active={active}
                    onToggle={(val) => toggleFilter('category', val)}
                  />
                );
              })}
            </View>
            {!expanded.category && (
              <Button
                variant="neutral"
                onPress={() => setExpanded((p) => ({ ...p, category: true }))}
                style={{ marginTop: theme.spacing[2] }}
              >
                Load more
              </Button>
            )}
          </View>

          <View>
            <Text style={{ color: theme.colors.textPrimary, marginBottom: theme.spacing[2] }}>Difficulty</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
              {DIFFICULTIES.map((diff) => {
                const active = filters.difficulty === diff;
                return (
                  <Chip
                    key={diff}
                    tag={diff}
                    active={active}
                    onToggle={(val) => toggleFilter('difficulty', val)}
                  />
                );
              })}
            </View>
          </View>

          <View>
            <Text style={{ color: theme.colors.textPrimary, marginBottom: theme.spacing[2] }}>Tag</Text>
            {cats.map((category) => {
              const tags = TAGS[category] as readonly TagDef[];
              if (tags.length === 0) return null;

              const visibleTags = expanded.tag ? tags : tags.slice(0, 4);
              return (
                <View key={category} style={{ marginBottom: theme.spacing[2] }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
                    {visibleTags.map((tag) => {
                      const active = filters.tag === tag.id;
                      return (
                        <Chip
                          key={tag.id}
                          tag={tag.id}
                          active={active}
                          onToggle={(val) => toggleFilter('tag', val)}
                        />
                      );
                    })}
                  </View>
                </View>
              );
            })}
            {!expanded.tag && (
              <Button
                variant="neutral"
                onPress={() => setExpanded((p) => ({ ...p, tag: true }))}
                style={{ marginTop: theme.spacing[2] }}
              >
                Load more
              </Button>
            )}
          </View>
        </View>
      </BottomSheet>
    </>
  );
};
