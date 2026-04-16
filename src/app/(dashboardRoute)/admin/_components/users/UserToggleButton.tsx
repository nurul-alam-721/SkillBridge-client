import { Button } from "@/components/ui/button";
import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AdminUser, UserStatus } from "@/services/admin.service";

interface Props {
  user:     AdminUser;
  onToggle: (id: string, currentStatus: UserStatus) => Promise<void>;
}


export function UserToggleButton({ user, onToggle }: Props) {
  const [busy, setBusy] = useState(false);
  const active = user.status === "ACTIVE";

  if (user.role === "ADMIN")
    return <span className="text-xs text-muted-foreground">—</span>;

  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-8 rounded-xl gap-1.5 text-xs ${
        active
          ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
      }`}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await onToggle(user.id, user.status);
        setBusy(false);
      }}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : active ? (
        <><ShieldBan className="h-3.5 w-3.5" /> Ban</>
      ) : (
        <><ShieldCheck className="h-3.5 w-3.5" /> Unban</>
      )}
    </Button>
  );
}