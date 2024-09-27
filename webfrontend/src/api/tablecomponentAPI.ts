import { METHODS } from "http";

export const baseURL: string = "http://localhost:3001"; 

export interface AssetAPIResponseInterface {
    AssetType : string,
    id: string,
    AssetName: string,
    AssetAbbreviation: string, 
    AssetAmount: number,
    AssetPercentage: string,
    AssetValue: string,
    AssetMarketPrice: string
}

export interface getAssetsAPIObj {
    get: (slug: string) => Promise<AssetAPIResponseInterface[] | null> 
}
/**
 * The AssetsAPI object contains  HTTP methods for interacting with asset data.
 * Usage: AssetsAPI.{method}('slug'). 
 */
export const AssetsAPI: getAssetsAPIObj = {
    /**
     * This object method of the AssetsAPI object represents a HTTP get request. 
     * @param slug Path to access the resource.  
     * @returns This object method returns an array of objects or null in case of an error. 
     */
    get: async function (slug) { 
        try {
            // the cache strategy will be defined in a later date: cache argument will change, but for testing purposes its no-store for now
        let AssetsAPIResponse = await fetch(`${baseURL}/${slug}`, {cache: "no-store"})
        if(!AssetsAPIResponse.ok){
            console.error(`Error: Failed to fetch: Response Status: ${AssetsAPIResponse.status}`)
            return null
        }
        let AssetsAPIData = AssetsAPIResponse.json() 
        return AssetsAPIData
        } catch (error) {
            console.error("Error while fetching data in the Asset API Layer: " , error)
            return null
        }
    }
}; 