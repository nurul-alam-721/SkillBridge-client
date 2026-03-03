"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  tutorService,
  TutorProfile,
  TutorsQuery,
  Category,
} from "@/services/tutor.service";

const defautFilters: TutorsQuery = { page: 1, limit: 9 };

export function useTutors() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<TutorsQuery>(() => {
    const categoryId = searchParams.get("categoryId");
    return {
      ...defautFilters,
      ...(categoryId && { categoryId }),
    };
  });

  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    const timeout = setTimeout(() => {
      fetchTutors({ ...filters, search: search || undefined });
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, search, sort, fetchTutors]);

  const updateFilters = (partial: Partial<TutorsQuery>) =>
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));

  const resetFilters = () => {
    setFilters(defautFilters);
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
    updateFilters,
    resetFilters,
  };
}
