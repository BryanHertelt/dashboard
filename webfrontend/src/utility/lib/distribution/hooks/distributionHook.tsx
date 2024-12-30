"use client";
import { useQuery } from "@tanstack/react-query";
import { StructureLayer } from "@/api/layer";

const useDistributionData = (queryConstructor: any) => {
  const processedQueryData = queryConstructor.map((queryConstructor: any) => {
    const { data } = useQuery({
      queryKey: [queryConstructor.qKey],
      initialData: queryConstructor.initialData[0],
      staleTime: 1000 * 60 * 1,
      queryFn: async () => {
        const processedData = await StructureLayer.fetchDistributionUnits(
          `${queryConstructor.slug}`,
          `${queryConstructor.searchquery}`
        );
        return processedData[0];
      },
      retryDelay: (attemptIndex): number => {
        return Math.min(1000 * 2 ** attemptIndex, 33000);
      },
    });
    return { data };
  });
  return { processedQueryData };
};

export default useDistributionData;
