"use client";
import { TutorProfile, Category } from "@/types";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { tutorService } from "@/services/tutor.service";
import { metaService } from "@/services/meta.service";
import { PlatformStats } from "@/types";
import { HeroSection } from "@/app/(commonRoute)/_components/home/HeroSection";
import { CategoriesSection } from "@/app/(commonRoute)/_components/home/CategoriesSection";
import { FeaturedTutorsSection } from "@/app/(commonRoute)/_components/home/FeaturedTutorsSection";
import { HowItWorksSection } from "@/app/(commonRoute)/_components/home/HowItWorks";
import { CtaSection } from "@/app/(commonRoute)/_components/home/CtaSection";

export default function HomePage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, tutorRes, platformStats] = await Promise.all([
        tutorService.getCategories(),
        tutorService.getAll({
          page: 1,
          limit: 6,
          sortBy: "rating",
          sortOrder: "desc",
        }),
        metaService.getStats(),
      ]);

      setCategories(cats);
      setTutors(tutorRes.tutors);
      setStats(platformStats);
    } catch (err) {
      console.error("Homepage fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchSubmit = () => {
    if (search.trim()) {
      router.push(`/tutors?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/tutors");
    }
  };

  return (
    <main>
      <HeroSection
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        totalStudents={stats?.totalStudents ?? 0}
        totalTutors={stats?.totalTutors ?? 0}
        totalSubjects={stats?.totalSubjects ?? 0}
        avgRating={stats?.avgRating ?? 0}
        loading={loading}
        categories={categories}
      />
      <CategoriesSection loading={loading} categories={categories} />
      <FeaturedTutorsSection tutors={tutors} loading={loading} />
      <HowItWorksSection />
      <CtaSection />
    </main>
  );
}
