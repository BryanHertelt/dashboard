"use client";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
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
  AssetHoldings,
} from "../types/data-fetching-types";
import { QueryConstructorInterface } from "../types/data-fetching-types";
import { syncSingleHolding } from "../stores";
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

export const useHoldingMutation = ({
  setSyncStatus,
  queryClient,
}: {
  setSyncStatus: Function;
  queryClient: QueryClient;
}) => {
  return useMutation({
    mutationFn: async (holdingId: number) => {
      const data = await postHoldingSync(holdingId.toString());
      return data;
    },
    onMutate: async (holdingId: number) => {
      // Set status to "syncing" before the mutation starts
      setSyncStatus((prev: { holdingId: number; status: string }[]) =>
        prev.map((item) =>
          item.holdingId === holdingId ? { ...item, status: "syncing" } : item
        )
      );
    },
    onSuccess: (updatedHolding) => {
      queryClient.setQueryData(["PortfolioAD", "Holdings"], (oldData: AssetHoldings | undefined) => {
        if (!oldData?.holdings) return oldData;
        return {
          ...oldData,
          holdings: oldData.holdings.map((holding: Holding) =>
            holding.holdingid === updatedHolding.holdingid
              ? updatedHolding
              : holding
          ),
        };
      });

      setSyncStatus((prev: { holdingId: number; status: string }[]) =>
        prev.map((item) =>
          item.holdingId === updatedHolding.holdingid
            ? { ...item, status: "synced" }
            : item
        )
      );

      queryClient.invalidateQueries({ queryKey: ["PortfolioAD", "Asset-Groups"] });
      queryClient.invalidateQueries({ queryKey: ["PortfolioAD", "Assets"] });
    },
    onError: (_error, holdingId: number) => {
      setSyncStatus((prev: { holdingId: number; status: string }[]) =>
        prev.map((item) =>
          item.holdingId === holdingId ? { ...item, status: "error" } : item
        )
      );
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

export const useDetailComponent = (props: { tableStatus: string | undefined; assetId: number }) => {
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
