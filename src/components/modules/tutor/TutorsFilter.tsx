"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Category, TutorsQuery } from "@/services/tutor.service";
import { cn } from "@/lib/utils";

interface TutorsFilterProps {
  categories: Category[];
  filters: TutorsQuery;
  onChange: (partial: Partial<TutorsQuery>) => void;
  onReset: () => void;
}

const PRICE_PRESETS = [
  { label: "Any",        min: undefined, max: undefined },
  { label: "< 300",      min: undefined, max: 300       },
  { label: "300–600",    min: 300,       max: 600       },
  { label: "600–1000",   min: 600,       max: 1000      },
  { label: "1000+",      min: 1000,      max: undefined },
];

export function TutorsFilter({ categories, filters, onChange, onReset }: TutorsFilterProps) {
  const activePreset = PRICE_PRESETS.findIndex(
    (p) => p.min === filters.minPrice && p.max === filters.maxPrice
  );

  return (
    <div className="space-y-5">

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Subject
        </Label>
        <Select
          value={filters.categoryId ?? "all"}
          onValueChange={(val) =>
            onChange({ categoryId: val === "all" ? undefined : val })
          }
        >
          <SelectTrigger className="h-9 rounded-xl text-sm">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Price / hr (BDT)
        </Label>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => onChange({ minPrice: preset.min, maxPrice: preset.max })}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                activePreset === i
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom min/max */}
        <div className="flex items-center gap-2 pt-0.5">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="h-8 rounded-lg text-xs"
          />
          <span className="text-muted-foreground text-xs shrink-0">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="h-8 rounded-lg text-xs"
          />
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="w-full rounded-lg h-8 text-xs"
      >
        Reset all filters
      </Button>
    </div>
  );
}