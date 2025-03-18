import '@testing-library/jest-dom'
import { DataTable } from "../../src/utility/lib/design-components/datatables/table-layout/data-table"
import AssetTableComponent from "../../src/utility/lib/build-components/asset-table-component"
import { render, screen, fireEvent } from "@testing-library/react"
import { ErrorSkeleton } from '../../src/utility/lib/datafetching/loading-skeleton'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { LoadingSkeleton } from '../../src/utility/lib/datafetching/loading-skeleton'
import {formatDataColsCurrency, formatDataColsNft, formatDataColsDerivative} from "../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols"

jest.mock("../../src/utility/lib/design-components/datatables/table-layout/data-table", () => ({
    DataTable: jest.fn().mockImplementation(()=> null), 
}))

jest.mock("../../src/utility/lib/datafetching/loading-skeleton", () => ({
    LoadingSkeleton: jest.fn().mockImplementation(()=> null), 
}))

jest.mock("../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols", () => ({
    formatDataColsCurrency: jest.fn().mockImplementation(()=> null), 
    formatDataColsNft: jest.fn().mockImplementation(()=> null), 
    formatDataColsDerivative: jest.fn().mockImplementation(()=> null)
}))

const mockInitial = [
    {
        "symbol": "A",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 1,
        "holdingid": 1,
        "assettype": "cryptocurrency",
        "assetid": 1,
        "assetname": "Bitcoin",
        "assetabbreviation": "BTC",
        "assetamount": 0.5,
        "assetpercentage": 4,
        "assetvalue": 700000,
        "assetmarketprice": 1400000,
        "assetchange24h": 5,
        "assetchange24hourvalue": 35000,
        "assetchange7d": [680000, 690000, 710000, 695000, 700000],
        "notes": "Notes"
    },
    {
      "symbol": "C",
      "portfolioid": 1,
      "userid": 1,
      "groupid": 2,
      "holdingid": 7,
      "assetpercentage": 3,
      "assettype": "derivative",
      "assetid": 12,
      "derivativename": "BTCUSDT",
      "derivateexchange":"Bybit" ,
      "positiontype": "open",
      "tradedirection": "long", 
      "derivativetype": "future",
      "leverage": 5,
      "size": 15000,
      "entry": 30000,
      "unrealizedpl": 2500,
      "price": 32000,
      "liquidationprice": 25000,
      "margin": 100,
      "tp": 3,
      "sl": 29,
      "settlementdate": "2024-06-15T10:00:00.000Z",
       "notes": "Notes"
    },
    {
        "symbol": "C",
        "portfolioid": 1,
        "userid": 1,
        "groupid": 2,
        "holdingid": 7,
        "assetpercentage": 3,
        "assettype": "derivative",
        "assetid": 18,
        "derivativename": "LTCUSDT",
        "derivateexchange":"Bybit" ,
        "positiontype": "open",
        "tradedirection": "short", 
        "derivativetype": "perpetual",
        "leverage": 15,
        "size": 5000,
        "entry": 100,
        "unrealizedpl": -250,
        "price": 95,
        "liquidationprice": 85,
        "margin": 35,
        "tp": 10,
        "sl": null,
        "settlementdate": "",
         "notes": "Notes"
      },
    {
      "symbol": "B",
      "portfolioid": 1,
      "userid": 1,
      "groupid": 2,
      "holdingid": 7,
      "assetpercentage": 3,
      "assettype": "nft",
      "assetid": 312,
      "collectionname": "Bored Ape Yacht Club",
      "collectionvalue": 1200,
      "collectionfloorprice": 1200,
      "nftcount": 20,
      "notes": "Notes"
    }
 ]


 describe("general render of asset table component", () => {
    let queryClient
    beforeEach(()=> {
        jest.clearAllMocks() 
        queryClient = new QueryClient()
        render(
            <QueryClientProvider client={queryClient}>
                <AssetTableComponent initial={mockInitial} />
            </QueryClientProvider>
        );
    })
    
    afterEach(()=> jest.clearAllMocks())

    it("renders DataTable ", () => {
        expect(DataTable).toHaveBeenCalledTimes(1)
    })
    it("calls initial columns", () => {
        expect(formatDataColsCurrency).toHaveBeenCalledTimes(1)
    })

    it("renders relevant elements", () => {
        expect(screen.getByRole("button", { name: /Cryptocurrencies/i })).toBeInTheDocument() 
        expect(screen.getByRole("button", { name: /NFTs/i })).toBeInTheDocument() 
        expect(screen.getByRole("button", { name: /Derivatives/i })).toBeInTheDocument() 
        expect(screen.getByText("Assets")).toBeInTheDocument()
    })
 })



 describe("Crypto State", () => {
    let queryClient
    beforeEach(()=> {
        jest.clearAllMocks() 
        queryClient = new QueryClient()
        render(
            <QueryClientProvider client={queryClient}>
                <AssetTableComponent initial={mockInitial} />
            </QueryClientProvider>
        );
    })
    
    afterEach(()=> jest.clearAllMocks())

    it("rerenders the datatable onClick", () => {
        const cryptoBtn = screen.getByRole("button", { name: /Cryptocurrencies/i })
        const nftBtn = screen.getByRole("button", { name: /NFTs/i })
        fireEvent.click(nftBtn)
        fireEvent.click(cryptoBtn)
        expect(formatDataColsCurrency).toHaveBeenCalledTimes(1)
        expect(DataTable).toHaveBeenCalledTimes(2)
        expect(DataTable.mock.calls[0]).toEqual([{"columns": null, "data": [{"assetabbreviation": "BTC", "assetamount": 0.5, "assetchange24h": 5, "assetchange24hourvalue": 35000, "assetchange7d": [680000, 690000, 710000, 695000, 700000], "assetid": 1, "assetmarketprice": 1400000, "assetname": "Bitcoin", "assetpercentage": 4, "assettype": "cryptocurrency", "assetvalue": 700000, "groupid": 1, "holdingid": 1, "notes": "Notes", "portfolioid": 1, "symbol": "A", "userid": 1}], "expandedRow": null, "tableStatus": "cryptocurrency"}, {}]
        )
        expect(formatDataColsCurrency).toHaveBeenCalledWith(expect.arrayContaining([
                mockInitial[0]
        ]), expect.any(Object), expect.any(Function))
 })
})

describe("Derivative State", () => {
    let queryClient
    beforeEach(()=> {
        jest.clearAllMocks() 
        queryClient = new QueryClient()
        render(
            <QueryClientProvider client={queryClient}>
                <AssetTableComponent initial={mockInitial} />
            </QueryClientProvider>
        );
    })
    
    afterEach(()=> jest.clearAllMocks())

    describe("perp/derivative filter", () => {

        beforeEach(()=> {
            jest.clearAllMocks()
            const derivativeBtn = screen.getByRole("button", { name: /Derivative/i } )
            fireEvent.click(derivativeBtn)
        })

        afterEach(()=> jest.clearAllMocks)

        it("renders the perp and derivative filter ", () => {
            expect(screen.getByRole("button", { name: /Perpetual/i } )).toBeInTheDocument()
            expect(screen.getByRole("button", { name: /Future/i } )).toBeInTheDocument()
        })
        
        it("filter perps", () => {
            const perpBtn = screen.getByRole("button", { name: /Perpetual/i } )
            fireEvent.click(perpBtn)
            expect(DataTable.mock.calls[2]).toEqual([{
                "columns": null,
                 "data": expect.arrayContaining([mockInitial[2]]),
                 "expandedRow": null, 
                 "tableStatus": "derivative"}, {}])
        })
        it("filter future", () => {
            const futureBtn = screen.getByRole("button", { name: /Future/i } )
            fireEvent.click(futureBtn)
            expect(DataTable.mock.calls[2]).toEqual([{
                "columns": null,
                 "data": expect.arrayContaining([mockInitial[1]]),
                 "expandedRow": null, 
                 "tableStatus": "derivative"}, {}])
        })
        it("renders everything, if both are clicked", () => {
            const perpBtn = screen.getByRole("button", { name: /Perpetual/i } )
            fireEvent.click(perpBtn)
            const futureBtn = screen.getByRole("button", { name: /Future/i } )
            fireEvent.click(futureBtn)

            expect(DataTable.mock.calls[4]).toEqual(
                [{
                    "columns": null,
                    "data": expect.arrayContaining([mockInitial[1], mockInitial[2]]), 
                    "expandedRow": null, 
                    "tableStatus": "derivative"}, {}]
            )

        })
        
    })

    it("initially renders the datatable with correct cols", () => {
        const derivativeBtn = screen.getByRole("button", { name: /Derivative/i } )
        fireEvent.click(derivativeBtn)
        expect(DataTable.mock.calls[1]).toEqual(
            [{
                "columns": null,
                "data": expect.arrayContaining([mockInitial[1], mockInitial[2]]), 
                "expandedRow": null, 
                "tableStatus": "derivative"}, {}]
        )
        expect(formatDataColsDerivative).toHaveBeenCalledWith([mockInitial[1], mockInitial[2]], expect.any(Object), expect.any(Function))
    })
})

describe("nft state", () => {
    let queryClient
    beforeEach(()=> {
        jest.clearAllMocks() 
        queryClient = new QueryClient()
        render(
            <QueryClientProvider client={queryClient}>
                <AssetTableComponent initial={mockInitial} />
            </QueryClientProvider>
        );
    })
    
    afterEach(()=> jest.clearAllMocks())
    it("calls formatNFT with the correct arguments", () => {
        const nftBtn = screen.getByRole("button", { name: /NFTs/i } )
        fireEvent.click(nftBtn)
        expect(formatDataColsNft).toHaveBeenCalledWith([mockInitial[3]], expect.any(Object), expect.any(Function))
    })
    it("calls the datatable with the right arguments", () => {
        const nftBtn = screen.getByRole("button", { name: /NFTs/i } )
        fireEvent.click(nftBtn)
        expect(DataTable.mock.calls[1]).toEqual([{
            "columns": null,
            "data": expect.arrayContaining([mockInitial[3]]), 
            "expandedRow": null, 
            "tableStatus": "nft"},
             {}])
    })
})

