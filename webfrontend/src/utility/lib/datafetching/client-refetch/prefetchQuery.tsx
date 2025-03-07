import { getDetailAssetData } from "../layer";

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
