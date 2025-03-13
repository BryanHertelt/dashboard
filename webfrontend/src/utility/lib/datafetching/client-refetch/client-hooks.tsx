"use client";
import { useQuery } from "@tanstack/react-query";
import { getPortfolioData } from "../layer";
import {
  QueryConstructorInterfaceDistribution,
  QueryConstructorInterfaceChart,
} from "../../types/data-fetching-types";
import { getDetailAssetData } from "../layer";

export const useDistributionData = (
  queryConstructor: QueryConstructorInterfaceDistribution
) => {
  if (!queryConstructor || Object.keys(queryConstructor).length === 0) {
    console.error(
      "useDistributionData Hook: Refetch not possible, because there is no queryConstructor provided."
    );
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryConstructor.qKey,
    initialData: queryConstructor.initialData || [],
    staleTime: queryConstructor.staleTime,
    gcTime: queryConstructor.cacheTime,
    queryFn: async () => {
      const processedData = await queryConstructor.queryFunction();
      return processedData;
    },
    retryDelay: (attemptIndex: number): number => {
      return Math.min(1000 * 2 * attemptIndex, 33000);
    },
    enabled: !!queryConstructor.qKey,
  });
  const processedQueryData = data;
  return { processedQueryData, isLoading, isError, error };
};

export const useValueChart = (
  queryConstructor: QueryConstructorInterfaceChart
) => {
  if (!queryConstructor || Object.keys(queryConstructor).length === 0) {
    console.error(
      "useDistributionData Hook: Refetch not possible, because there is no queryConstructor provided."
    );
    /** 
    return {
      processedQueryData: [],
      isLoading: false,
      isError: true,
      error: new Error("No queryConstructor provided"),
    };
    */
  }
  console.log("Key", queryConstructor.qKey);
  console.log("Searchquery", queryConstructor.searchquery);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryConstructor.qKey],
    staleTime: 2000,
    gcTime: 2000,
    queryFn: async () => {
      const result = await queryConstructor.queryFunction(
        queryConstructor.searchquery
      );
      console.log("This is the resul ", result);
      return result;
    },
    retryDelay: (attemptIndex: number): number => {
      return Math.min(1000 * 2 * attemptIndex, 33000);
    },
    enabled: queryConstructor.qKey.length > 0,
  });
  const processedQueryData = data;
  return { processedQueryData, isLoading, isError, error };
};

export const useDetailComponent = (props: any) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["detail components", props.assetId],
    queryFn: async () =>
      await getDetailAssetData(props.tableStatus, props.assetId),
    gcTime: 2000,
    staleTime: 2000,
    retry: 3,
    /* istanbul ignore next */
    retryDelay: (attemptIndex: number): number => {
      return Math.min(1000 * 3 * attemptIndex, 10000);
    },
  });
  return { data, isLoading, isError, error };
};
