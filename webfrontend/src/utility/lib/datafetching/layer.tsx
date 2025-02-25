export const portfolioId = "1";
export const baseUrl = `http://localhost:3001/${portfolioId}`;
export const StructureLayer = {
  getPortfolioData: async function () {
    const possibleSlugs = [
      "",
      "users",
      "portfolios",
      "assets",
      "assetgroups",
      "holdings",
    ];
    try {
      let rawdata = await fetch(
        `${baseUrl}`,
        // while dev, need fast data updates, replace with cache strategy in build
        { cache: "no-store" }
      );
      if (!rawdata.ok) {
        throw new Error("API is not reachable");
      }
      let data = await rawdata.json();
      if (
        !Array.isArray(data.assets) ||
        !data.assets.every(
          (item: any) => typeof item === "object" && item !== "null"
        )
      ) {
        throw new Error(
          "Invalid response format: Assets are not an array of objects"
        );
      }
      return data;
    } catch (error) {
      console.error("Error occured in fetchDistribution Units " + `${error}`);
      return ["failed", error];
    }
  },
  getDetailAssetData: async function (slug: string, assetid: number) {
    try {
      let rawdata = await fetch(`${baseUrl}/${slug}?assetid=${assetid}`, {
        cache: "no-store",
      });
      if (!rawdata.ok) {
        throw new Error("API is not reachable yest");
      }
      console.log(
        "This is the rawdata in the getDetailAssetData Function",
        rawdata
      );
      let data = rawdata.json();
      console.log("This is the data in the getAsset Data Function:", data);
      return data;
    } catch (error) {
      console.error(
        "Error occuredd while fetching the detail asset pop up" + `${error}`
      );
      throw new Error("Error occured while fetching the detail asset pop up");
    }
  },
};
