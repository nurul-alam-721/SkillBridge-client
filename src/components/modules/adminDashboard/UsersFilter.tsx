import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserRole, UserStatus } from "@/services/admin.service";

const ROLES:    { value: UserRole    | "ALL"; label: string }[] = [
  { value: "ALL",     label: "All Roles" },
  { value: "STUDENT", label: "Students" },
  { value: "TUTOR",   label: "Tutors" },
  { value: "ADMIN",   label: "Admins" },
];

const STATUSES: { value: UserStatus | "ALL"; label: string }[] = [
  { value: "ALL",    label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "BANNED", label: "Banned" },
];

interface UsersFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  role: UserRole | "ALL";
  onRoleChange: (v: UserRole | "ALL") => void;
  status: UserStatus | "ALL";
  onStatusChange: (v: UserStatus | "ALL") => void;
  total: number;
  filtered: number;
}

function FilterTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
      {options.map(({ value: v, label }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
            value === v
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function UsersFilter({
  search, onSearchChange,
  role,   onRoleChange,
  status, onStatusChange,
  total, filtered,
}: UsersFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 rounded-xl text-sm"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Role filter */}
      <FilterTabs options={ROLES}    value={role}   onChange={onRoleChange} />

      {/* Status filter */}
      <FilterTabs options={STATUSES} value={status} onChange={onStatusChange} />

      {/* Count */}
      <span className="ml-auto text-xs text-muted-foreground shrink-0">
        {filtered} of {total}
      </span>
    </div>
  );
}