"use client";
import { useQuery } from "@tanstack/react-query";
import { StructureLayer } from "@/api/layer";
import { QueryConstructorInterface } from "../types";

const useDistributionData = (queries: QueryConstructorInterface[]) => {
  if (!queries || queries.length === 0) {
    console.error(
      "useDistributionData Hook: Refetch not possible, because there is no queryConstructor provided."
    );
  }
  const processedQueryData = queries.map(
    (queryConstructor: QueryConstructorInterface) => {
      const { data } = useQuery({
        queryKey: queryConstructor.qKey,
        initialData: queryConstructor.initialData,
        staleTime: 1000 * 10 * 1,
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
      });
      return { data };
    }
  );
  return { processedQueryData };
};

export default useDistributionData;
