"use client";
import { UserRole, UserStatus } from "@/types";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";


interface Props {
  search:         string;
  onSearchChange: (v: string) => void;
  role:           UserRole | "ALL";
  onRoleChange:   (v: UserRole | "ALL") => void;
  status:         UserStatus | "ALL";
  onStatusChange: (v: UserStatus | "ALL") => void;
  total:          number;
  filtered:       number;
}

const ROLES:    (UserRole   | "ALL")[] = ["ALL", "STUDENT", "TUTOR", "ADMIN"];
const STATUSES: (UserStatus | "ALL")[] = ["ALL", "ACTIVE", "INACTIVE", "BANNED"];

const ROLE_LABEL: Record<UserRole | "ALL", string> = {
  ALL: "All Roles", STUDENT: "Students", TUTOR: "Tutors", ADMIN: "Admins",
};
const STATUS_LABEL: Record<UserStatus | "ALL", string> = {
  ALL: "All Status", ACTIVE: "Active", INACTIVE: "Inactive", BANNED: "Banned",
};

export function UsersFilter({
  search, onSearchChange,
  role,   onRoleChange,
  status, onStatusChange,
  total,  filtered,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {/* Role pills */}
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => onRoleChange(r)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              role === r
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {ROLE_LABEL[r]}
          </button>
        ))}

        <div className="w-px bg-border self-stretch mx-1" />

        {/* Status pills */}
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              status === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {filtered !== total && (
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {filtered} of {total}
          </p>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 w-56 rounded-xl text-sm"
          />
        </div>
      </div>
    </div>
  );
}