import type { ShotResult, ShotType, ShotZone } from "@/src/types/shot";
import type { TeamTheme } from "@/src/types/team";

export type ShotFilters = {
  season: string;
  opponent: string;
  shotResult: "all" | ShotResult;
  shotType: "all" | ShotType;
  shotZone: "all" | ShotZone;
  shotDistance: "all" | "0-10" | "10-20" | "20-plus";
};

type FiltersPanelProps = {
  filters: ShotFilters;
  options: {
    seasons: string[];
    opponents: string[];
    shotZones: ShotZone[];
  };
  onFilterChange: <Key extends keyof ShotFilters>(
    key: Key,
    value: ShotFilters[Key]
  ) => void;
  onReset: () => void;
  teamTheme: TeamTheme;
};

export function FiltersPanel({
  filters,
  options,
  onFilterChange,
  onReset,
  teamTheme
}: FiltersPanelProps) {
  return (
    <section className="glass-panel rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p
            className="text-[0.66rem] font-black uppercase tracking-[0.24em]"
            style={{ color: teamTheme.accent }}
          >
            Filters
          </p>
          <h2 className="mt-1 text-lg font-black text-white">Shot Filters</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/10"
          style={{ borderColor: `${teamTheme.accent}60` }}
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FilterSelect
          label="Season"
          value={filters.season}
          onChange={(value) => onFilterChange("season", value)}
          options={[
            { value: "all", label: "All Seasons" },
            ...options.seasons.map((season) => ({ value: season, label: season }))
          ]}
        />
        <FilterSelect
          label="Opponent"
          value={filters.opponent}
          onChange={(value) => onFilterChange("opponent", value)}
          options={[
            { value: "all", label: "All Opponents" },
            ...options.opponents.map((opponent) => ({
              value: opponent,
              label: opponent
            }))
          ]}
        />
        <FilterSelect
          label="Result"
          value={filters.shotResult}
          onChange={(value) =>
            onFilterChange("shotResult", value as ShotFilters["shotResult"])
          }
          options={[
            { value: "all", label: "All Results" },
            { value: "made", label: "Made" },
            { value: "missed", label: "Missed" }
          ]}
        />
        <FilterSelect
          label="Type"
          value={filters.shotType}
          onChange={(value) =>
            onFilterChange("shotType", value as ShotFilters["shotType"])
          }
          options={[
            { value: "all", label: "All Types" },
            { value: "2PT Field Goal", label: "2PT Field Goal" },
            { value: "3PT Field Goal", label: "3PT Field Goal" }
          ]}
        />
        <FilterSelect
          label="Zone"
          value={filters.shotZone}
          onChange={(value) =>
            onFilterChange("shotZone", value as ShotFilters["shotZone"])
          }
          options={[
            { value: "all", label: "All Zones" },
            ...options.shotZones.map((zone) => ({ value: zone, label: zone }))
          ]}
        />
        <FilterSelect
          label="Distance"
          value={filters.shotDistance}
          onChange={(value) =>
            onFilterChange(
              "shotDistance",
              value as ShotFilters["shotDistance"]
            )
          }
          options={[
            { value: "all", label: "All Distances" },
            { value: "0-10", label: "0-10 ft" },
            { value: "10-20", label: "10-20 ft" },
            { value: "20-plus", label: "20+ ft" }
          ]}
        />
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border border-white/10 bg-slate-950 px-3 text-sm font-bold text-white outline-none transition focus:border-white/35"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
