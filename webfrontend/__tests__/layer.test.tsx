import { StructureLayer } from "../src/api/layer";

describe("testing API layer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return data, if everything is ok", async () => {
    const mockJSON = [{ id: 1, asset: "Bitcoin" }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJSON),
      })
    ) as jest.Mock;
    const result = await StructureLayer.fetchDistributionUnits(
      "assets",
      "assettype=cryptocurrency"
    );
    console.log("THis is the result of the fetch in layer test:", result);
    expect(result).toEqual(mockJSON);
  });

  it("should test if called with the right url", async () => {
    await StructureLayer.fetchDistributionUnits(
      "assets",
      "assettype=cryptocurrency"
    );

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:4000/assets?assettype=cryptocurrency`,
      { cache: "no-store" }
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should throw an error, when the wrong slug is passed", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = await StructureLayer.fetchDistributionUnits("fail", "");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "fail is not a valid resource"
    );
    expect(result).toStrictEqual(["failed"]);
    consoleErrorSpy.mockRestore;
  });

  it("should throw an error, when the promise is rejected", async () => {
    const mockJSON = [{ id: 1, asset: "Bitcoin" }];
    global.fetch = jest.fn(() =>
      Promise.reject({
        ok: true,
        json: () => Promise.resolve(mockJSON),
      })
    ) as jest.Mock;

    const consoleErrorSpy = jest.spyOn(console, "error");

    const result = await StructureLayer.fetchDistributionUnits(
      "assets",
      "assettype=cryptocurrency"
    );

    expect(result).toStrictEqual(["failed"]);

    consoleErrorSpy.mockRestore;
  });

  it("should throw an error if data is not an array ", async () => {
    const mockJSON = { id: 1, asset: "Bitcoin" };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJSON),
      })
    ) as jest.Mock;
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = await StructureLayer.fetchDistributionUnits(
      "assets",
      "assettype=cryptocurrency"
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error occured in fetchDistribution Units Error: Invalid response format: response isn't an array of objects"
    );
    expect(result).toStrictEqual(["failed"]);
    consoleErrorSpy.mockRestore;
  });
  it("should throw an error if data inside array is not an object", async () => {
    const mockJSON = [{ id: 1, asset: "Bitcoin" }, "id"];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockJSON),
      })
    ) as jest.Mock;
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = await StructureLayer.fetchDistributionUnits(
      "assets",
      "assettype=cryptocurrency"
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error occured in fetchDistribution Units Error: Invalid response format: response isn't an array of objects"
    );
    expect(result).toStrictEqual(["failed"]);
    consoleErrorSpy.mockRestore;
  });

  it("should throw an error if rawdata is not ok", async () => {
    const mockResponse = [{ id: 1, asset: "Bitcoin" }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(mockResponse),
      })
    ) as jest.Mock;
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = await StructureLayer.fetchDistributionUnits(
      "assets",
      "assettype=cryptocurrency"
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error occured in fetchDistribution Units Error: API is not reachable"
    );
    expect(result).toStrictEqual(["failed"]);
    consoleErrorSpy.mockRestore;
  });
});
