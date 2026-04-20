import { UserRole } from "@/types";
import Image from "next/image";


const FALLBACK_CLS: Record<UserRole, string> = {
  STUDENT: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  TUTOR:   "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  ADMIN:   "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
};

interface Props {
  name:   string | null;
  email:  string | null;
  image?: string | null;
  role:   UserRole;
}

export function UserAvatarCell({ name, email, image, role }: Props) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      {image ? (
        <Image
          src={image}
          alt={name ?? ""}
          width={32}
          height={32}
          className="rounded-full object-cover shrink-0 border border-border"
        />
      ) : (
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0
            border border-border text-xs font-bold ${FALLBACK_CLS[role]}`}
        >
          {(name ?? "?").charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{name ?? "—"}</p>
        <p className="text-xs text-muted-foreground truncate">{email ?? "—"}</p>
      </div>
    </div>
  );
}