import { isObject } from "../helpers";
import axios from "axios";

export const portfolioId = "1";
export const baseUrl = `http://localhost:3001/${portfolioId}`;

export const getDistribution = async (
  distributionUnit: "group" | "all" | "holding"
) => {
  const url =
    distributionUnit === "holding"
      ? `${baseUrl}/holdings`
      : distributionUnit === "group"
      ? `${baseUrl}/assetgroups`
      : baseUrl;
  try {
    let rawdata = await fetch(
      `${url}`,
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

export const postHoldingSync = async (holdingId: string) => {
  const response = await axios.post(`${baseUrl}/sync-holdings/${holdingId}`);
  return response.data;
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
    let rawdata = await fetch(`${baseUrl}/${scope}?timeframe=${timeframe}`, {
      cache: "no-store",
    });
    let data = await rawdata.json();

    data.map((timebit: { x: string; y: number[] }) => {
      if (typeof timebit.x != "string") {
        throw new Error("Wrong format for timestamps");
      }
      timebit.y.map((y) => {
        if (typeof y != "number") {
          return new Error("Wrong format for values");
        }
      });
    });
    return data;
  } catch (error) {
    throw new Error(`Error occured while fetching the timeframe`, {
      cause: error,
    });
  }
};

export const postRebalancing = async (
  assetId: string | number,
  balance: number
) => {
  try {
    const response = await axios.post(`${baseUrl}/detailtype`, {
      assetId,
      desiredbalance: balance,
    });
    console.log("response", response);
  } catch (error) {
    console.error("Error updating desired balance", error);
  }
};
