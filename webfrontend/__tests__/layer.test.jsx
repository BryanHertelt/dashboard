import {StructureLayer} from "../src/api/layer"

describe('Test API Layer for portfolio structure units (Holdings, AssetGroups and overall distribution',()=> {
beforeEach(()=> {
    fetchMock.resetMocks()
})
it('should return parsed JSON when fetch succeeds with 200 status', async()=> {
    const mockData = {key:'value'}; 
    fetchMock.mockResponseOnce(JSON.stringify(mockData)); 

const result = await StructureLayer.fetchDistributionUnits('testSlug', 'testQuery'); 
expect(result).toEqual(mockData); 
expect(fetchMock).toHaveBeenCalledTimes(1); 
expect(fetchMock).toHaveBeenCalledWith(
    'http://localhost:4000/testSlug?testQuery', 
    {cache: 'no-store'}
)
})
it('should error log as expected', async() => {
    console.error = jest.fn()
    fetchMock.mockResponseOnce('', {status: 404}); 
    
    const result = await StructureLayer.fetchDistributionUnits('testSlug', 'testQuery')
    expect(result).toBeNull(); 
    expect(console.error).toHaveBeenCalledWith(
        'Error occured while fetching: , 404'
    )
})
it('should return null if response is not ok', async()=> {
    console.error = jest.fn()
    fetchMock.mockReject(new Error('Network Error')); 

    const result = await StructureLayer.fetchDistributionUnits('testSlug', 'testQuery')
    expect(result).toBeNull() 
    expect(console.error).toHaveBeenCalledWith(
        'Error while fetching data in the distribution layer: ', 
        expect.any(Error)
    )
})
it('should return json if the the response is invalid json and log the error', async()=> {
console.error = jest.fn(); 
fetchMock.mockReject(new Error('Invalid JSON')); 

const result = await StructureLayer.fetchDistributionUnits('testSlug', 'testQuery')
expect(result).toBeNull()
expect(console.error).toHaveBeenCalledWith(
    "Error while fetching data in the distribution layer: ",
    expect.any(Error)
)
})
})
