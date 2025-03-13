import { getDetailAssetData } from "../layer";
import { getTimeFrame } from "../../utils";

export const prefetchDetailComponent = async (
  assettype: string,
  id: number,
  queryClient: any
) => {
  await queryClient.prefetchQuery({
    queryKey: ["detail components", id],
    queryFn: async () => await getDetailAssetData(assettype, id),
    staleTime: 2000,
    gcTime: 2000,
    retry: 3,
    /* istanbul ignore next */
    retryDelay: function (attemptIndex: number): number {
      return Math.min(1000 * 2 * attemptIndex, 33000);
    },
  });
};

// not useful right now
export const prefetchChartData = async (
  queryClient: any,
  qKey: string[],
  queryFunction: any,
  searchquery: string
) => {
  await queryClient.prefetchQuery({
    queryKey: [qKey],
    queryFn: async () => {
      const result = await queryFunction(searchquery);
      return result;
    },
    staleTime: 2000,
    gcTime: 2000,
    retryDelay: (attemptIndex: number): number => {
      return Math.min(1000 * 2 * attemptIndex, 33000);
    },
  });
};
