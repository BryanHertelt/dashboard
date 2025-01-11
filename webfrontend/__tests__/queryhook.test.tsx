import { renderHook } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import useDistributionData from "@/utility/lib/distribution/hooks/distributionHook";
import { StructureLayer } from "../src/api/layer";

// Mock dependencies
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));
jest.mock("../src/api/layer", () => ({
  __esModule: true,
  StructureLayer: {
    fetchDistributionUnits: jest.fn(),
  },
}));

describe("useDistributionData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should map queries to useQuery calls correctly", async () => {
    const mockQueries = [
      {
        qKey: ["query1"],
        slug: "slug1",
        searchquery: "query1",
        initialData: [],
      },
      {
        qKey: ["query2"],
        slug: "slug2",
        searchquery: "query2",
        initialData: [],
      },
    ];
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => ({
      data: `data for ${queryKey}`,
    }));

    const { result } = renderHook(() => useDistributionData(mockQueries));

    expect(useQuery).toHaveBeenCalledTimes(2);
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["query1"],
        initialData: [],
        queryFn: expect.any(Function),
        retryDelay: expect.any(Function),
        staleTime: 10000,
      })
    );
    expect(result.current.processedQueryData).toEqual([
      { data: "data for query1" },
      { data: "data for query2" },
    ]);
  });

  it("should return an empty array if there is no query Constructor provided", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { result } = renderHook(() => useDistributionData([]));
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "useDistributionData Hook: Refetch not possible, because there is no queryConstructor provided."
    );
    expect(result.current.processedQueryData).toStrictEqual([]);
    consoleErrorSpy.mockRestore;
  });

  it("should call StructureLayer.fetchDistributionUnits with correct args", () => {
    const mockQueries = [
      {
        qKey: ["query1"],
        slug: "slug1",
        searchquery: "query1",
        initialData: [],
      },
    ];

    (StructureLayer.fetchDistributionUnits as jest.Mock).mockImplementation(
      (slug, searchquery) => Promise.resolve("mocked data")
    );

    (useQuery as jest.Mock).mockImplementation(({ queryFn }) => {
      queryFn();
      return { data: [] };
    });

    renderHook(() => useDistributionData(mockQueries));

    expect(StructureLayer.fetchDistributionUnits).toHaveBeenCalledWith(
      "slug1",
      "query1"
    );
  });

  it("should handle an empty queries array", () => {
    const { result } = renderHook(() => useDistributionData([]));

    expect(result.current.processedQueryData).toEqual([]);
    expect(useQuery).not.toHaveBeenCalled();
  });

  it("should implement retry logic correctly", () => {
    const mockQueries = [
      {
        qKey: ["query1"],
        slug: "slug1",
        searchquery: "query1",
        initialData: [],
      },
    ];

    (useQuery as jest.Mock).mockImplementation(({ retryDelay }) => {
      expect(retryDelay(0)).toBe(1000);
      expect(retryDelay(1)).toBe(2000);
      expect(retryDelay(5)).toBe(32000);
      expect(retryDelay(6)).toBe(33000);
      return { data: [] };
    });

    renderHook(() => useDistributionData(mockQueries));
  });
});
