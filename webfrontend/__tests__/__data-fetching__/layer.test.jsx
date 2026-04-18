import { getDetailAssetData, baseUrl } from "@/utility/lib/data-fetching/layer";

describe("getDetailAssetData API Layer", () => {
  
  // Helper to mock fetch responses quickly
  const mockFetchResponse = (overrides = {}) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, asset: "Bitcoin" }),
        ...overrides,
      })
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns data when the response is successful and valid", async () => {
    const mockJSON = { id: 1, asset: "Bitcoin" };
    mockFetchResponse({ json: () => Promise.resolve(mockJSON) });

    const result = await getDetailAssetData("cryptocurrency", 1);
    
    expect(result).toEqual(mockJSON);
    expect(fetch).toHaveBeenCalledWith(`${baseUrl}/cryptocurrency?assetid=1`, {
      cache: "no-store",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("throws a specific error when the response object is empty", async () => {
    mockFetchResponse({ json: () => Promise.resolve({}) });

    // Use .rejects to catch errors and verify the cause
    await expect(getDetailAssetData("cryptocurrency", 1)).rejects.toThrow(
      "Error occured while fetching the detail asset pop up"
    );

    // Verify the inner cause if your custom error supports it
    try {
      await getDetailAssetData("cryptocurrency", 1);
    } catch (err) {
      expect(err.cause.message).toBe("Object is empty");
    }
  });

  it("throws when the response format is an array instead of an object", async () => {
    mockFetchResponse({ json: () => Promise.resolve(["not-an-object"]) });

    await expect(getDetailAssetData("cryptocurrency", 1)).rejects.toThrow(
      "Error occured while fetching the detail asset pop up"
    );
    
    try {
      await getDetailAssetData("cryptocurrency", 1);
    } catch (err) {
      expect(err.cause.message).toBe("Wrong response format: data is not an object");
    }
  });

  it("throws 'API is not reachable' when response.ok is false", async () => {
    mockFetchResponse({ ok: false });

    await expect(getDetailAssetData("cryptocurrency", 1)).rejects.toThrow();
    
    try {
      await getDetailAssetData("cryptocurrency", 1);
    } catch (err) {
      expect(err.cause.message).toBe("API is not reachable");
    }
  });

  it("handles a total network rejection (fetch crash)", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network Down")));

    await expect(getDetailAssetData("cryptocurrency", 1)).rejects.toThrow();
  });
});