import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Program = Tables<"programs">;

// Fetch all programs (with optional filters)
export function usePrograms(filters?: {
  regionCity?: string;
  category?: string;
  freeOnly?: boolean;
  openOnly?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ["programs", filters],
    queryFn: async () => {
      let query = supabase.from("programs").select("*");

      if (filters?.regionCity && filters.regionCity !== "all") {
        query = query.eq("region_city", filters.regionCity);
      }
      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.freeOnly) {
        query = query.eq("cost", "무료");
      }
      if (filters?.openOnly) {
        query = query.eq("status", "신청가능");
      }
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,support_detail.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Fetch programs for a specific region
export function useRegionPrograms(regionCity: string) {
  return useQuery({
    queryKey: ["programs", "region", regionCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("region_city", regionCity)
        .order("category");
      if (error) throw error;
      return data;
    },
    enabled: !!regionCity,
  });
}

// Fetch region stats (program counts grouped by region_city)
export function useRegionStats() {
  return useQuery({
    queryKey: ["programs", "regionStats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("region_city, category");
      if (error) throw error;

      // Group by region_city
      const stats: Record<string, { total: number; categories: Record<string, number> }> = {};
      for (const row of data) {
        if (!stats[row.region_city]) {
          stats[row.region_city] = { total: 0, categories: {} };
        }
        stats[row.region_city].total++;
        stats[row.region_city].categories[row.category] =
          (stats[row.region_city].categories[row.category] || 0) + 1;
      }
      return { stats, totalPrograms: data.length };
    },
  });
}

// Fetch distinct region cities for filter dropdown
export function useRegionCities() {
  return useQuery({
    queryKey: ["programs", "cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("region_city")
        .order("region_city");
      if (error) throw error;
      const unique = [...new Set(data.map((d) => d.region_city))];
      return unique;
    },
  });
}

// Category stats across all programs
export function useNationalCategoryStats() {
  return useQuery({
    queryKey: ["programs", "nationalCategories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("category");
      if (error) throw error;

      const counts: Record<string, number> = {};
      for (const row of data) {
        counts[row.category] = (counts[row.category] || 0) + 1;
      }
      return counts;
    },
  });
}
