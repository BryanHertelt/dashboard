import { getDetailAssetData } from "@/utility/lib/data-fetching/layer";
import { baseUrl } from "@/utility/lib/data-fetching/layer";

describe("testing API layer for detailcomponent:", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return data, if everything is ok", async () => {
    const mockJSON = { id: 1, asset: "Bitcoin" };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJSON),
      })
    ) as jest.Mock;
    const result = await getDetailAssetData("cryptocurrency", 1);
    expect(result).toEqual(mockJSON);
  });

  it("should be called with the right url once", async () => {
    await getDetailAssetData("cryptocurrency", 1);

    expect(fetch).toHaveBeenCalledWith(`${baseUrl}/cryptocurrency?assetid=1`, {
      cache: "no-store",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should throw if object is empty", async () => {
    const mockJSON = {};
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJSON),
      })
    ) as jest.Mock;

    try {
      await getDetailAssetData("cryptocurrency", 1);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      if (err instanceof Error) {
        expect(err.message).toBe(
          "Error occured while fetching the detail asset pop up"
        );
        if (err.cause instanceof Error) {
          expect(err.cause.message).toBe("Object is empty");
        }
      }
    }
  });

  it("should throw if response is not an object", async () => {
    const mockJSON = ["mock"];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJSON),
      })
    ) as jest.Mock;

    try {
      await getDetailAssetData("cryptocurrency", 1);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      if (err instanceof Error) {
        expect(err.message).toBe(
          "Error occured while fetching the detail asset pop up"
        );
        if (err.cause instanceof Error) {
          expect(err.cause.message).toBe(
            "Wrong response format: data is not an object"
          );
        }
      }
    }
  });

  it("should throw if response is not ok", async () => {
    const mockJSON = { asset: "bitcoin", id: 1 };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockJSON),
      })
    ) as jest.Mock;

    try {
      await getDetailAssetData("cryptocurrency", 1);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      if (err instanceof Error) {
        expect(err.message).toBe(
          "Error occured while fetching the detail asset pop up"
        );
        if (err.cause instanceof Error) {
          expect(err.cause.message).toBe("API is not reachable");
        }
      }
    }
  });

  it("should throw if response is not ok", async () => {
    const mockJSON = { asset: "bitcoin", id: 1 };
    global.fetch = jest.fn(() =>
      Promise.reject({
        ok: false,
        json: () => Promise.reject(mockJSON),
      })
    ) as jest.Mock;

    await expect(getDetailAssetData).rejects.toThrow();
  });
});
