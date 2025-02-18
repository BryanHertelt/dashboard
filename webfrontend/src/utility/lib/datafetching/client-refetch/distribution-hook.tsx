"use client";
import { useQuery } from "@tanstack/react-query";
import { StructureLayer } from "../layer";
import { QueryConstructorInterface } from "../../types/data-fetching-types";

const useDistributionData = (queries: QueryConstructorInterface[]) => {
  if (!queries || queries.length === 0) {
    console.error(
      "useDistributionData Hook: Refetch not possible, because there is no queryConstructor provided."
    );
  }
  const processedQueryData = queries.map(
    (queryConstructor: QueryConstructorInterface) => {
      const { data, isLoading, refetch } = useQuery({
        queryKey: queryConstructor.qKey,
        initialData: queryConstructor.initialData || [],
        staleTime: queryConstructor.staleTime,
        gcTime: queryConstructor.cacheTime,
        queryFn: async () => {
          const processedData = await StructureLayer.fetchDistributionUnits(
            `${queryConstructor.slug}`,
            `${queryConstructor.searchquery}`
          );
          return processedData;
        },
        retryDelay: (attemptIndex: number): number => {
          return Math.min(1000 * 2 ** attemptIndex, 33000);
        },
        enabled: !!queryConstructor.qKey,
      });
      return { data, isLoading };
    }
  );
  return { processedQueryData };
};

export default useDistributionData;
