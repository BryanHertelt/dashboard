import { useQuery } from "@tanstack/react-query";
import { getDetailAssetData } from "../layer";

export const useDetailComponent = (props: any) => {
 const {data, isLoading, isError, error} = useQuery({
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
  console.log(data, isLoading, isError, error)
  return {data, isLoading, isError, error}
}