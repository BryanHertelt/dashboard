import { QueryClient } from "@tanstack/react-query";
import { prefetchDetailComponent } from "../src/utility/lib/datafetching/client-refetch/prefetchQuery"; // Update this path to match your module location
import { getDetailAssetData } from "../src/utility/lib/datafetching/layer"; // Update this path to match your actual module location

jest.mock("../src/utility/lib/datafetching/layer", () => ({
  getDetailAssetData: jest.fn(),
}));

describe("prefetchDetailComponent", () => {
  let queryClient: QueryClient;
  const mockData = { asset: "bitcoin" };

  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.clear();
  });

  it("calls getDetailAssetData with correct parameters", async () => {
    (getDetailAssetData as jest.Mock).mockResolvedValue(mockData);

    await prefetchDetailComponent("cryptocurrency", 1, queryClient);

    expect(getDetailAssetData).toHaveBeenCalledWith("cryptocurrency", 1);
  });

  it("stores the fetched data in the query cache", async () => {
    (getDetailAssetData as jest.Mock).mockResolvedValue(mockData);
    await prefetchDetailComponent("cryptocurrency", 1, queryClient);

    const cachedData = queryClient.getQueryData(["detail components", 1]);
    expect(cachedData).toEqual(mockData);
  });

  it("calls queryClient.prefetchQuery with correct parameters", async () => {
    (getDetailAssetData as jest.Mock).mockResolvedValue(mockData);
    const prefetchQuerySpy = jest.spyOn(queryClient, "prefetchQuery");

    await prefetchDetailComponent("cryptocurrency", 1, queryClient);

    expect(prefetchQuerySpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["detail components", 1],
        staleTime: 1000 * 60,
        gcTime: 1000 * 60,
      })
    );

    prefetchQuerySpy.mockRestore();
  });
});
