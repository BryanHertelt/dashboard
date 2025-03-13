import { isObject } from "../helpers/helper-functions";
import { Axios } from "axios";

export const portfolioId = "1";
export const baseUrl = `http://localhost:3001/${portfolioId}`;

export const getPortfolioData = async () => {
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
    if (!isObject(data)) {
      throw new Error("Invalid response format: PortfolioData isn't an object");
    }
    if (Object.keys(data).length === 0) {
      throw new Error("Object is empty");
    }
    return data;
  } catch (error) {
    console.error("Error occured in fetchDistribution Units " + `${error}`);

    return ["failed", error];
  }
};

export const getDetailAssetData = async (
  slug: string | undefined,
  assetid: number
) => {
  try {
    let rawdata = await fetch(`${baseUrl}/${slug}?assetid=${assetid}`, {
      cache: "no-store",
    });
    if (!rawdata.ok) {
      throw new Error("API is not reachable");
    }

    let data = await rawdata.json();
    if (!isObject(data)) {
      throw new Error("Wrong response format: data is not an object");
    }
    if (Object.keys(data).length === 0) {
      throw new Error("Object is empty");
    }
    return data;
  } catch (error) {
    throw new Error(`Error occured while fetching the detail asset pop up`, {
      cause: error,
    });
  }
};

export const getTimeFrames = async (scope: string, timeframe: string) => {
  try {
    console.log("called");
    let rawdata = await fetch(
      `${baseUrl}/portfoliotimeframes?${scope}=${timeframe}`,
      {
        cache: "no-store",
      }
    );
    let data = await rawdata.json();
    data.map((data: any) =>
      data.map((timebit: { x: string; y: number }) => {
        if (typeof timebit.x != "string") {
          throw new Error("Wrong format for timestamps");
        }
        if (typeof timebit.y != "number") {
          throw new Error("Wrong Format for Values");
        }
      })
    );
    return data;
  } catch (error) {
    throw new Error(`Error occured while fetching the timeframe`, {
      cause: error,
    });
  }
};
