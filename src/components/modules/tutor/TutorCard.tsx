import Image from "next/image";
import Link from "next/link";
import { Star, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorProfile } from "@/services/tutor.service";

const fadedShadow = {
  boxShadow: [
    "0 1px 2px rgba(0,0,0,0.04)",
    "0 4px 8px rgba(0,0,0,0.04)",
    "0 10px 20px rgba(0,0,0,0.04)",
    "0 20px 40px rgba(0,0,0,0.04)",
  ].join(", "),
};

export function TutorCard({ tutor }: { tutor: TutorProfile }) {
  const initial = (tutor.user.name ?? "T").charAt(0).toUpperCase();

  return (
    <div
      className="rounded-2xl border bg-card p-5 flex flex-col gap-4 transition-transform hover:-translate-y-0.5"
      style={fadedShadow}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden bg-muted">
          {tutor.user.image ? (
            <Image src={tutor.user.image} alt={tutor.user.name ?? "Tutor"} fill className="object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center font-semibold text-muted-foreground">
              {initial}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold leading-tight truncate">{tutor.user.name ?? "Unknown"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{tutor.category.name}</p>
          <div className="flex items-center gap-1 mt-1">
            <BriefcaseBusiness className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {tutor.experience} yr{tutor.experience !== 1 ? "s" : ""} exp
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm shrink-0">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium">{tutor.rating.toFixed(1)}</span>
          <span className="text-muted-foreground text-xs">({tutor.totalReviews})</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {tutor.bio ?? "No bio provided."}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <p className="text-sm">
          <span className="font-bold text-base">BDT {tutor.hourlyRate}</span>
          <span className="text-muted-foreground"> / hr</span>
        </p>
        <Button asChild size="sm" className="rounded-xl">
          <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
        </Button>
      </div>
    </div>
  );
}