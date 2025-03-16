import { useDetailComponent } from "../src/utility/lib/datafetching/client-refetch/client-hooks";
import { useQuery } from "@tanstack/react-query";
import { getDetailAssetData } from "../src/utility/lib/datafetching/layer";
import { renderHook} from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { fireEvent } from "@testing-library/react";

jest.mock("../src/utility/lib/datafetching/layer", () => ({
    getDetailAssetData: jest.fn().mockImplementation(() => mock)
}))

const useDetailComponent = (props) => {
  return useQuery(["detail components", props.id], getDetailAssetData);
};


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

