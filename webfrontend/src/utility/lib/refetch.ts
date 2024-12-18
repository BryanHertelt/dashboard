import { StructureLayer } from "@/api/layer"


export const refetchAD = async (slug:string, searchquery: string, rawdata:any, calls: number)=> {
const timeBetweenCalls: number[] = [1000, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5000, 5000, 5000]
while(calls < timeBetweenCalls.length && !rawdata.ok){
    console.log("Calls is smaller than the lenght of timeBetween calls:" , calls< timeBetweenCalls.length) 
    console.log("Rawdata returns an boolean true:" ,!rawdata.ok)
    console.log("Logical AND returns false as long the loop is running with calls:", calls < timeBetweenCalls.length && !rawdata.ok)
    console.error(`Call ${calls + 1} failed, retrying in a few seconds...`)
    console.log("Calls in the beginning of the while loop:" , calls)
    await new Promise(resolve => setTimeout(resolve, timeBetweenCalls[calls]))
    calls++
    try {
        rawdata = await StructureLayer.fetchDistributionUnits(slug, searchquery, calls); 
    } catch (error) {
        console.error(`Error during ${calls}:`, error)
    }
    }
    if(!rawdata.ok){
        console.error(`All ${calls} retries failed`)
        return []
     }
return rawdata
}; 
