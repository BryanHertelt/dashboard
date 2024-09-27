import { AssetsAPI, baseURL} from "@/api/tablecomponentAPI";


describe('Asset API Tests', () => {
    const mockAsset = {   
        "AssetType" : "Cryptocurrency",
        "id": "120032r",
        "AssetName": "Bitcoin",
        "AssetAbbreviation": "BTC", 
        "AssetAmount": 12,
        "AssetPercentage": "23%",
        "AssetValue": "120000 USD",
        "AssetMarketPrice": "456233 USD" }

        
beforeEach(()=> {
    jest.clearAllMocks() 
})
 

it('should return an array with mocked Asset data', async()=> {
    global.fetch= jest.fn(()=> 
        Promise.resolve({
            json: () => Promise.resolve(mockAsset),
            ok: true 
        }as Response)
    );
const data = await AssetsAPI.get("assets"); 

expect(data).toEqual(mockAsset)
}) 

it('checks if right url is generated from the argument',async ()=> {
    global.fetch= jest.fn(()=> 
        Promise.resolve({
            json: () => Promise.resolve(mockAsset)
        }as Response)
    );  
    const slug = "assets"
    await AssetsAPI.get(slug)
    expect(global.fetch).toHaveBeenCalledWith(`${baseURL}/assets`,{ cache: 'no-store' })
})

it('checks if an error with the corresponding status message is thrown if the fetch fails', async()=> {
    global.fetch= jest.fn(()=> 
    Promise.resolve({
        json: () => Promise.resolve(mockAsset), 
        ok: false,
        status: 404 
    }as Response))
    expect(await AssetsAPI.get("assets")).toBeNull()
})

it('checks if null is returned, when promise is rejected', async() => {
    global.fetch = jest.fn(()=> 
    Promise.reject(new Error('Promise rejected')))
    const AssetsAPIResponse = await AssetsAPI.get("assets")
    expect(AssetsAPIResponse).toBeNull() 
})

})    

