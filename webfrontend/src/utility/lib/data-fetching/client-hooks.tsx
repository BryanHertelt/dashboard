"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import logger from "../logging/logger";
import {
  getDistribution,
  postHoldingSync,
  getTimeFrames,
  getDetailAssetData,
} from "../data-fetching";
import {
  QueryConstructorInterfaceDistribution,
  MutationConstructorInterface,
  QueryConstructorInterfaceChart,
  Holding,
} from "../types/data-fetching-types";
import { QueryConstructorInterface } from "../types/data-fetching-types";
import { useSyncSingleHolding } from "../stores";
import { SyncStatusItem, SyncStoreState } from "../stores/clear-cache";

export const useDistributionData = (
  queryConstructor: QueryConstructorInterface
) => {
  if (!queryConstructor || Object.keys(queryConstructor).length === 0) {
    logger.error(
      "useDistributionData Hook: Refetch not possible, because there is no queryConstructor provided."
    );
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryConstructor.qKey,
    initialData: queryConstructor.initialData || [],
    staleTime: queryConstructor.staleTime,
    gcTime: queryConstructor.cacheTime,
    queryFn: async () => {
      const processedData = await queryConstructor.queryFunction(
        queryConstructor.distributionScope
      );
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

export const useHoldingMutation = (
  queryConstructor: MutationConstructorInterface
) => {
  if (!queryConstructor || Object.keys(queryConstructor).length === 0) {
    logger.error(
      "useDistributionData Hook: Sync not possible, because there is no queryConstructor provided."
    );
  }
  const { data, isError, error } = useMutation({
    mutationFn: () => postHoldingSync(queryConstructor.holdingId),
    onSuccess: (updatedHolding) => {
      queryConstructor.queryClient.setQueryData(
        ["PortfolioAd"],
        (oldData: any) => {
          if (!oldData?.holdings) return oldData;
          return {
            ...oldData,
            holdings: oldData.holdings.map((holding: Holding) =>
              holding.holdingid === updatedHolding.holdingid
                ? updatedHolding
                : holding
            ),
          };
        }
      );
      queryConstructor.setSyncStatus((prev: SyncStatusItem[]) => {
        prev.map((item) =>
          item.holdingId === updatedHolding.holdingid
            ? { ...item, syncStatus: "noSync" }
            : item
        );
      });
      queryConstructor.queryClient.invalidateQueries([
        "PortfolioAD",
        "Holdings",
      ]);
      queryConstructor.queryClient.invalidateQueries([
        "PortfolioAD",
        "Asset-Groups",
      ]);
    },
    onError: (error, holdingId) => {
      queryConstructor.setSyncStatus((prev: SyncStatusItem[]) => {
        prev.map((item) =>
          item.holdingId === Number(queryConstructor.holdingId)
            ? { ...item, syncStatus: "error" }
            : item
        );
      });
    },
  });
};

export const useValueChart = (
  queryConstructor: QueryConstructorInterfaceChart
) => {
  if (!queryConstructor || Object.keys(queryConstructor).length === 0) {
    console.error(
      "useDistributionData Hook: Refetch not possible, because there is no queryConstructor provided."
    );
    return {
      processedQueryData: [],
      isLoading: false,
      isError: true,
      error: new Error("No queryConstructor provided"),
    };
  }
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: [queryConstructor.qKey],
    staleTime: 5000,
    gcTime: 5000,
    queryFn: async () => {
      const result = await getTimeFrames(
        queryConstructor.scope,
        queryConstructor.searchquery
      );
      return result;
    },
    retryDelay: (attemptIndex: number): number => {
      return Math.min(1000 * 2 * attemptIndex, 33000);
    },
  });
  const processedQueryData = data;
  return { processedQueryData, isLoading, isError, error, isSuccess };
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
