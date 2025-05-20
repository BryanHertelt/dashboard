import { useDetailComponent, useValueChart } from "../../src/utility/lib/data-fetching/client-refetch/client-hooks";
import { useQuery } from "@tanstack/react-query";
import { getDetailAssetData, getTimeFrames} from "../../src/utility/lib/data-fetching/layer";
import { renderHook} from "@testing-library/react";
import { waitFor, waitForNextUpdate } from "@testing-library/react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

jest.mock("../../src/utility/lib/datafetching/layer", () => ({
    getDetailAssetData: jest.fn().mockImplementation(() => mock),
    getTimeFrames: jest.fn().mockImplementation(()=> mock)
}))


const useValueChart = (props) => {
  return useQuery([props.qKey], getTimeFrames)
}

const useDetailComponent = (props) => {
  return useQuery(["detail components", props.id], getDetailAssetData);
};


describe("useValueChart Component", () => {
  const queryConstructor = {
    qKey: ["portfoliotimeframes", "7 days"],
    initialData: "fetched data",
    searchquery: "7days",
    scope: "portfoliotimeframes",
  };

  const mock = jest.fn().mockResolvedValue("fetched data");

  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          retry: false,
        },
        logger: {
          log: console.log,
          warn: console.warn,
          error: process.env.NODE_ENV === "test" ? () => {} : console.error,
        },
      },
    });

    getTimeFrames.mockImplementation(mock);
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useQuery cache behavior", () => {

    it("fetches new data if cache is empty", async () => {
      queryClient.clear();

      const { result} = renderHook(
        ({ queryConstructor }) => useValueChart(queryConstructor),
        { initialProps: { queryConstructor }, wrapper }
      );

      await waitFor(() => {
        expect(getTimeFrames).toHaveBeenCalledTimes(1);
        expect(result.current.processedQueryData).toBe("fetched data");
      });

    });

    it("handles missing queryConstructor gracefully", async () => {
      const { result } = renderHook(() => useValueChart(null), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error.message).toBe("No queryConstructor provided");
      });

      expect(getTimeFrames).not.toHaveBeenCalled();
    });
  });

  describe("retryDelay function", () => {
    let retryDelayFn;

    beforeEach(() => {
      retryDelayFn = jest.fn((attemptIndex) => {
        return Math.min(1000 * 2 * attemptIndex, 33000);
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
      expect(retryDelayFn(1)).toBe(2000);
      expect(retryDelayFn(2)).toBe(4000);
      expect(retryDelayFn(10)).toBe(20000);
      expect(retryDelayFn(20)).toBe(33000); // Max cap
    });
  });
});





describe("useDetail Component", () => {
  describe("useQuery cache behavior", () => {
    const mock = Promise.resolve("fetched data")
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity, 
          retry: false , 
        },
        logger: {
            log: console.log,
            warn: console.warn,
            error: process.env.NODE_ENV === 'test' ? () => {} : console.error,
          },
      },
    });
  
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    
  
    beforeEach(() => {
      queryClient.clear(); 
      getDetailAssetData.mockImplementation(()=> mock)
      jest.clearAllMocks();
    });
  
    afterEach(()=> {
      jest.clearAllMocks()
    })
  
    it("retrieves data from cache if already stored", async () => {
      queryClient.setQueryData(["detail components", 1], "fetched data");
  
      const { result } = renderHook(({ assetId }) => useDetailComponent({ assetId }), {
          initialProps: { assetId: 1 }, 
          wrapper,
        });
  
      await waitFor(() =>{
          expect(result.current.data).toBe("fetched data");
      });
    });
  
    it("fetches new data if cache is empty", async () => {
      queryClient.clear();
  
      const { result } = renderHook(({assetId}) => useDetailComponent({assetId}), {initialProps:{assetId: 1}, wrapper });
  
      await waitFor(() => {
          expect(result.current.data).toBe("fetched data");
          expect(getDetailAssetData).toHaveBeenCalledTimes(1); 
      });
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
})

