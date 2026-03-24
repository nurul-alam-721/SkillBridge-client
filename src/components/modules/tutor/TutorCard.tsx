import Link from "next/link";
import { Star, BriefcaseBusiness, CalendarCheck, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TutorProfile } from "@/services/tutor.service";

export function TutorCard({ tutor }: { tutor: TutorProfile }) {
  const availableSlots = tutor.availability?.filter((s) => !s.isBooked).length ?? 0;
  const initial = (tutor.user.name ?? "T").charAt(0).toUpperCase();

  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="group relative flex flex-col bg-card border border-border/50 rounded-3xl overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer"
    >
      {/* Ambient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative flex flex-col h-full p-6 gap-5">

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <Avatar className="h-13 w-13 ring-2 ring-border/40 group-hover:ring-primary/30 transition-all duration-300">
                <AvatarImage src={tutor.user.image ?? undefined} alt={tutor.user.name ?? "Tutor"} />
                <AvatarFallback className="text-lg font-bold bg-linear-to-br from-primary/20 to-primary/5 text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>
              {availableSlots > 0 && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-card" />
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-[15px] leading-snug text-foreground truncate group-hover:text-primary transition-colors duration-200">
                {tutor.user.name ?? "Unknown"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {tutor.category.name}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-foreground tabular-nums">
                {tutor.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {tutor.totalReviews} review{tutor.totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ── Bio ── */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {tutor.bio && tutor.bio !== "No bio provided"
            ? tutor.bio
            : "No bio provided yet."}
        </p>

        {/* ── Stats row ── */}
        <div className="flex items-center gap-4 py-3 px-3.5 rounded-2xl bg-muted/40 border border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0" />
            <span className="font-medium">{tutor.experience} year{tutor.experience !== 1 ? "s" : ""}</span>
          </div>
          <div className="h-3 w-px bg-border/60" />
          <div className="flex items-center gap-1.5 text-xs">
            <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {availableSlots > 0 ? (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {availableSlots} slot{availableSlots !== 1 ? "s" : ""} free
              </span>
            ) : (
              <span className="text-muted-foreground font-medium">No slots</span>
            )}
          </div>
          <div className="ml-auto text-xs text-muted-foreground font-medium">
            <span className="text-base font-bold text-foreground tabular-nums">
              ৳{tutor.hourlyRate}
            </span>
            <span className="ml-0.5">/hr</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {availableSlots > 0 ? "Available to book" : "Check back later"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-3 transition-all duration-300">
            View Profile
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
          </span>
        </div>

      </div>
    </Link>
  );
}