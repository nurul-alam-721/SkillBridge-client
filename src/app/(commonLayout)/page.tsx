"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tutorService, TutorProfile, Category } from "@/services/tutor.service";
import { HeroSection } from "@/components/modules/home/HeroSection";
import { CategoriesSection } from "@/components/modules/home/CategoriesSection";

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch]         = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tutors, setTutors]         = useState<TutorProfile[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    // Fetch categories and top-rated tutors in parallel
    Promise.all([
      tutorService.getCategories(),
      tutorService.getAll({ page: 1, limit: 6 }),
    ])
      .then(([cats, tutorRes]) => {
        setCategories(cats);
        setTutors(tutorRes.tutors);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      />

      <CategoriesSection categories={categories} />


    </main>
  );
}