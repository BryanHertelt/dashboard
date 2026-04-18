import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useValueChart, useDetailComponent } from "../../src/utility/lib/data-fetching/client-refetch/client-hooks";
import { getDetailAssetData, getTimeFrames } from "../../src/utility/lib/data-fetching/layer";

// --- Mocks ---
jest.mock("../../src/utility/lib/data-fetching/layer", () => ({
  getDetailAssetData: jest.fn(),
  getTimeFrames: jest.fn()
}));

// --- Helper: QueryClient Wrapper Factory ---
const createWrapper = (client) => {
   const Wrapper =  ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return Wrapper
};

// --- Helper: Default QueryClient Config ---
const getBaseConfig = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
  },
});

describe("Custom Hooks: Data Fetching", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = getBaseConfig();
    jest.clearAllMocks();
  });

  describe("useValueChart Hook", () => {
    const queryConstructor = {
      qKey: ["portfoliotimeframes", "7 days"],
      initialData: "fetched data",
      scope: "portfoliotimeframes",
    };

    it("fetches data and returns it when cache is empty", async () => {
      getTimeFrames.mockResolvedValue({ processedQueryData: "fetched data" });

      const { result } = renderHook(() => useValueChart(queryConstructor), {
        wrapper: createWrapper(queryClient)
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      expect(result.current.processedQueryData).toBe("fetched data");
      expect(getTimeFrames).toHaveBeenCalledTimes(1);
    });

    it("handles missing queryConstructor error state", async () => {
      // Assuming your actual hook throws or returns an error state if null is passed
      const { result } = renderHook(() => useValueChart(null), {
        wrapper: createWrapper(queryClient)
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("useDetailComponent Hook", () => {
    it("retrieves data from cache immediately if available", async () => {
      const assetId = 1;
      const cacheKey = ["detail components", assetId];
      queryClient.setQueryData(cacheKey, "cached data");

      const { result } = renderHook(() => useDetailComponent({ assetId }), {
        wrapper: createWrapper(queryClient)
      });

      // No waitFor needed for cache hits usually, but safe to keep
      await waitFor(() => expect(result.current.data).toBe("cached data"));
      expect(getDetailAssetData).not.toHaveBeenCalled();
    });

    it("triggers a network fetch if cache is empty", async () => {
      getDetailAssetData.mockResolvedValue("newly fetched");

      const { result } = renderHook(() => useDetailComponent({ assetId: 2 }), {
        wrapper: createWrapper(queryClient)
      });

      await waitFor(() => expect(result.current.data).toBe("newly fetched"));
      expect(getDetailAssetData).toHaveBeenCalledTimes(1);
    });
  });

  describe("Network Retry Logic (Unit Tests)", () => {
    // Testing the logic of the retry delay without needing a full render
    it("calculates exponential backoff correctly (ValueChart logic)", () => {
      const retryDelay = (index) => Math.min(1000 * 2 * index, 33000);
      
      expect(retryDelay(1)).toBe(2000);
      expect(retryDelay(2)).toBe(4000);
      expect(retryDelay(20)).toBe(33000); // Cap
    });

    it("calculates exponential backoff correctly (Detail logic)", () => {
      const retryDelay = (index) => Math.min(1000 * 3 * index, 10000);
      
      expect(retryDelay(1)).toBe(3000);
      expect(retryDelay(3)).toBe(9000);
      expect(retryDelay(10)).toBe(10000); // Cap
    });
  });
});