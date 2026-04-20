"use client";
import { TutorProfile, TutorsQuery, Category } from "@/types";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { tutorService } from "@/services/tutor.service";

const default_filters: TutorsQuery = { page: 1, limit: 9 };

export function useTutors() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<TutorsQuery>(() => {
    const categoryId = searchParams.get("categoryId");
    return {
      ...default_filters,
      ...(categoryId && { categoryId }),
    };
  });

  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [sort, setSort] = useState("rating");

  const fetchTutors = useCallback(async (query: TutorsQuery) => {
    setLoading(true);
    try {
      const res = await tutorService.getAll(query);
      setTutors(res.tutors);
      setTotal(res.pagination.totalTutors);
      setTotalPages(res.pagination.totalPages);
    } catch {
      setTutors([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    tutorService
      .getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const sortMap: Record<
      string,
      { sortBy: string; sortOrder: "asc" | "desc" }
    > = {
      rating: { sortBy: "rating", sortOrder: "desc" },
      price_asc: { sortBy: "hourlyRate", sortOrder: "asc" },
      price_desc: { sortBy: "hourlyRate", sortOrder: "desc" },
      reviews: { sortBy: "totalReviews", sortOrder: "desc" },
      experience: { sortBy: "experience", sortOrder: "desc" },
    };
    const { sortBy, sortOrder } = sortMap[sort] ?? sortMap["rating"];

    const timeout = setTimeout(() => {
      fetchTutors({
        ...filters,
        search: search || undefined,
        sortBy,
        sortOrder,
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, search, sort, fetchTutors]);

  const updateFilters = (partial: Partial<TutorsQuery>) =>
    setFilters((prev: TutorsQuery) => ({ ...prev, ...partial, page: 1 }));

  const setPage = (page: number) => setFilters((prev: TutorsQuery) => ({ ...prev, page }));

  const resetFilters = () => {
    setFilters(default_filters);
    setSearch("");
    setSort("rating");
  };

  return {
    tutors,
    categories,
    total,
    totalPages,
    loading,
    filters,
    search,
    sort,
    setSearch,
    setSort,
    setPage,
    updateFilters,
    resetFilters,
  };
}