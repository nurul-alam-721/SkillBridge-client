"use client";
import { TutorProfile, Category } from "@/types";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { tutorService } from "@/services/tutor.service";
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
  const [totalTutors, setTotalTutors] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, tutorRes] = await Promise.all([
        tutorService.getCategories(),
        tutorService.getAll({
          page: 1,
          limit: 6,
          sortBy: "rating",
          sortOrder: "desc",
        }),
      ]);

      setCategories(cats);
      setTutors(tutorRes.tutors);
      setTotalTutors(tutorRes.pagination.totalTutors);

      const rated = tutorRes.tutors.filter((t) => (t.rating ?? 0) > 0);
      if (rated.length > 0) {
        const avg = rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / rated.length;
        setAvgRating(Math.round(avg * 10) / 10);
      }
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
        totalTutors={totalTutors}
        totalSubjects={categories.length}
        avgRating={avgRating}
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
