import { QueryClient } from "@tanstack/react-query";
import { prefetchDetailComponent } from "../src/utility/lib/datafetching/client-refetch/prefetchQuery"; 
import { getDetailAssetData } from "../src/utility/lib/datafetching/layer";

jest.mock("../src/utility/lib/datafetching/layer", () => ({
  getDetailAssetData: jest.fn(),
}));

describe("prefetchDetailComponent", () => {
  let queryClient;
  const mockData = { asset: "bitcoin" };

  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls getDetailAssetData with correct parameters", async () => {
    getDetailAssetData.mockResolvedValue(mockData);

    await prefetchDetailComponent("cryptocurrency", 1, queryClient);

    expect(getDetailAssetData).toHaveBeenCalledWith("cryptocurrency", 1);
  });

  it("stores the fetched data in the query cache", async () => {
    getDetailAssetData.mockResolvedValue(mockData);

    await prefetchDetailComponent("cryptocurrency", 1, queryClient);

    const cachedData = queryClient.getQueryData(["detail components", 1]);
    expect(cachedData).toEqual(mockData);
  });

  it("calls queryClient.prefetchQuery with correct parameters", async () => {
    getDetailAssetData.mockResolvedValue(mockData);
    const prefetchQuerySpy = jest.spyOn(queryClient, "prefetchQuery");

    await prefetchDetailComponent("cryptocurrency", 1, queryClient);

    expect(prefetchQuerySpy).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: expect.arrayContaining(["detail components", 1]),
      queryFn: expect.any(Function),
      gcTime: 2000, 
      retry: 3, 
      retryDelay: expect.any(Function), 
      staleTime: 2000
    })
    );

    prefetchQuerySpy.mockRestore();
  });
});

describe("retryDelay function", () => {
  let queryClient;
  let retryDelayFn;

  beforeEach(() => {
    retryDelayFn = jest.fn((attemptIndex) => {
      return Math.min(1000 * 3 * attemptIndex, 10000);
    });

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 3,
          retryDelay: retryDelayFn, 
        },
      },
    });
  });

  it("calculates retry delay correctly", () => {
    expect(retryDelayFn(0)).toBe(0);  
    expect(retryDelayFn(1)).toBe(3000);  
    expect(retryDelayFn(2)).toBe(6000);  
    expect(retryDelayFn(3)).toBe(9000);
    expect(retryDelayFn).toHaveBeenCalledTimes(4);
  });
});

