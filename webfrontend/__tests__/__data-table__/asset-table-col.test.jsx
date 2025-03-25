import '@testing-library/jest-dom'
import { formatDataColsCurrency, formatDataColsDerivative, formatDataColsNft } from "../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols";
import {
    AssetPercentageValueIcon,
    NotesInDataTableIcon,
  } from "../../public/images/index";
  import {
    PositionDirectionIcon,
    SortingDataTableIcon,
    ShowDetailIcon,
  } from "../../public/images/icons";
import { formatCurrency } from "../../src/utility/lib/helpers/helper-functions";
import { TableLineChart } from "../../src/utility/lib/design-components/charts/table-line-charts";
import {prefetchDetailComponent} from "../../src/utility/lib/datafetching/client-refetch/prefetch-hooks"
import { DataTable } from "../../src/utility/lib/design-components/datatables/table-layout/data-table";
import { ErrorSkeleton } from "../../src/utility/lib/datafetching/loading-skeleton";
import { render,screen, within } from "@testing-library/react";
import { formatCurrency, formatValue, cn} from '../../src/utility/lib/helpers/helper-functions'
import { twMerge } from 'tailwind-merge'
import { clsx } from "clsx";


jest.mock("../../src/utility/lib/helpers/helper-functions", () => ({
  formatValue: jest.fn((number)=> {
      if(isNaN(Number(number))){
        console.error("Type error in formatValue")
        return("")
      }
      const formattedValue = Number(number).toFixed(2)
    
      return formattedValue
    }),
  formatCurrency: jest.fn((number)=> {
      if(isNaN(Number(number))){
        console.error("Type error in formatCurrency")
        return("")
      }
    const formattedCurrency = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(number)); 
    return formattedCurrency
    }), 
    cn: jest.fn((...inputs) => {
      return twMerge(clsx(inputs))})
})) 

jest.mock("../../src/utility/lib/design-components/charts/table-line-charts", () => ({
    TableLineChart: jest.fn().mockImplementation(() => null)
}))
jest.mock("../../src/utility/lib/datafetching/client-refetch/prefetch-hooks", () => ({
    prefetchDetailComponent: jest.fn().mockImplementation(() => null)
}))
jest.mock("../../public/images/icons", () => ({
    PositionDirectionIcon: jest.fn().mockImplementation(() => null),
    SortingDataTableIcon: jest.fn().mockImplementation(() => null),
    ShowDetailIcon: jest.fn().mockImplementation(() => null)
}))
jest.mock("../../public/images/index", () => ({
    AssetPercentageValueIcon: jest.fn().mockImplementation(() => null),
    NotesInDataTableIcon: jest.fn().mockImplementation(() => null),
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
        "assetpercentage": 5,
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
      "assetname": "BTCUSDT",
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
        "assetname": "LTCUSDT",
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
      "assetname": "Bored Ape Yacht Club",
      "collectionvalue": 1200,
      "collectionfloorprice": 1200,
      "nftcount": 20,
      "notes": "Notes"
    }
 ]


jest.mock("../../src/utility/lib/datafetching/loading-skeleton", () => ({
    ErrorSkeleton: jest.fn().mockImplementation(()=> null), 
}))


jest.mock("../../src/utility/lib/design-components/datatables/table-layout/data-datatable-detail-popup", () => ({
    TableDetailComponent: jest.fn().mockImplementation(()=> null), 
    }))

const queryClient = null 
const setExpandedRow = null

    

describe("renders crypto cols as expected", () => {

beforeEach(()=> {
    jest.clearAllMocks()
    render(<DataTable data={[mockInitial[0]]} columns={formatDataColsCurrency([mockInitial[0]], queryClient, setExpandedRow)}/> )
})
afterEach(()=> jest.clearAllMocks())

it("renders the header", () => {
expect(screen.getByText("Asset")).toBeInTheDocument()
expect(screen.getByText("Amount")).toBeInTheDocument()
expect(screen.getByText("Percentage")).toBeInTheDocument()
expect(screen.getByText("Value")).toBeInTheDocument()
expect(screen.getByText("Market Price")).toBeInTheDocument()
expect(screen.getByText("Change 24 h")).toBeInTheDocument()
expect(screen.getByText("Change 7d")).toBeInTheDocument()
expect(screen.getByText("Notes")).toBeInTheDocument()
})
it("renders the body", () => {
    const name = screen.getByText("Bitcoin").closest("td");
    expect(within(name).getByText("Bitcoin")).toBeInTheDocument(); 

    const amount = screen.getByText(mockInitial[0].assetamount).closest("td");
    expect(within(amount).getByText(mockInitial[0].assetamount)).toBeInTheDocument(); 

    const percentage = screen.getByText(`${mockInitial[0].assetpercentage}%`).closest("td");
    expect(within(percentage).getByText(`${mockInitial[0].assetpercentage}%`)).toBeInTheDocument(); 

    const value = screen.getByText(formatCurrency(mockInitial[0].assetvalue)).closest("td");
    expect(within(value).getByText(formatCurrency(mockInitial[0].assetvalue))).toBeInTheDocument(); 

    const marketPrice = screen.getByText("$1,400,000.00").closest("td");
    expect(within(marketPrice).getByText("$1,400,000.00")).toBeInTheDocument(); 

    const change24 = screen.getByText(`${mockInitial[0].assetchange24h}%`).closest("td");
    expect(within(change24).getByText(`${mockInitial[0].assetchange24h}%`)).toBeInTheDocument(); 

    const change24Value = screen.getByText(formatCurrency(mockInitial[0].assetchange24hourvalue)).closest("td");
    expect(within(change24Value).getByText(formatCurrency(mockInitial[0].assetchange24hourvalue))).toBeInTheDocument(); 

    expect(TableLineChart).toHaveBeenCalled()
    expect(NotesInDataTableIcon).toHaveBeenCalled()
})

})

describe("renders nft cols as expected", () => {
    beforeEach(()=> {
        jest.clearAllMocks()
        render(<DataTable data={[mockInitial[3]]} columns={formatDataColsNft([mockInitial[3]], queryClient, setExpandedRow)}/> )
    })
    afterEach(()=> jest.clearAllMocks()) 

    it("renders header", () => {
expect(screen.getByText("Collection")).toBeInTheDocument()
expect(screen.getByText("Value")).toBeInTheDocument()
expect(screen.getByText("Floor Price")).toBeInTheDocument()
expect(screen.getByText("NFT-Count")).toBeInTheDocument()
expect(screen.getByText("Notes")).toBeInTheDocument()
    })
    it("renders table body", () => {
        const collection = screen.getByText(mockInitial[3].assetname).closest("td");
        expect(within(collection).getByText(mockInitial[3].assetname)).toBeInTheDocument(); 

        const value = screen.getByText(formatCurrency(mockInitial[3].collectionvalue)).closest("td"); 
        expect(within(value).getByText(formatCurrency(mockInitial[3].collectionvalue))).toBeInTheDocument(); 

        const floorPrice = screen.getByText(new RegExp(`${mockInitial[3].collectionfloorprice} ETH`)).closest("td");
        expect(within(floorPrice).getByText(new RegExp(`${mockInitial[3].collectionfloorprice} ETH`))).toBeInTheDocument();

        const nftCount = screen.getByText(mockInitial[3].nftcount).closest("td")
        expect(within(nftCount).getByText(mockInitial[3].nftcount)).toBeInTheDocument()

        expect(NotesInDataTableIcon).toHaveBeenCalled()

    });
})



describe("renders derivative cols as expected", () => {
    beforeEach(()=> {
        jest.clearAllMocks()
        render(<DataTable data={[mockInitial[1]]} columns={formatDataColsDerivative([mockInitial[1]], queryClient, setExpandedRow)}/> )
    })
    afterEach(()=> jest.clearAllMocks()) 

    it("renders the header", () => {
expect(screen.getByText("Position Type")).toBeInTheDocument()
expect(screen.getByText("Symbol")).toBeInTheDocument()
expect(screen.getByText("Entry")).toBeInTheDocument()
expect(screen.getByText("Liq - Price")).toBeInTheDocument()
expect(screen.getByText("Margin")).toBeInTheDocument()
expect(screen.getByText("SL/TP")).toBeInTheDocument()
expect(screen.getByText("Settlement Date")).toBeInTheDocument()
expect(screen.getByText("Notes")).toBeInTheDocument()
    })

    it("renders the body", () => {
        const tradeDirection = screen.getByText("Long").closest("td");
        expect(within(tradeDirection).getByText("Long")).toBeInTheDocument(); 

        const symbol = screen.getByText("BTCUSDT").closest("td");
        expect(within(symbol).getByText("BTCUSDT")) .toBeInTheDocument(); 

        const entry = screen.getByText(formatCurrency(mockInitial[1].entry)).closest("td");
        expect(within(entry).getByText(formatCurrency(mockInitial[1].entry))).toBeInTheDocument(); 

        const liqPrice = screen.getByText(formatCurrency(mockInitial[1].liquidationprice)).closest("td");
        expect(within(liqPrice).getByText(formatCurrency(mockInitial[1].liquidationprice))).toBeInTheDocument(); 

        const margin = screen.getByText(formatCurrency(mockInitial[1].margin)).closest("td");
        expect(within(margin).getByText(formatCurrency(mockInitial[1].margin))).toBeInTheDocument(); 

        const slTp = screen.getByText("29%/3%").closest("td");
        expect(within(slTp).getByText("29%/3%")).toBeInTheDocument(); 

        const settlement = screen.getByText("2024-06-1").closest("td");
        expect(within(settlement).getByText("2024-06-1")).toBeInTheDocument(); 

        expect(NotesInDataTableIcon).toHaveBeenCalled()

    })
})

describe("renders pereptual as expected", () => {
    beforeEach(()=> {
        jest.clearAllMocks()
        render(<DataTable data={[mockInitial[2]]} columns={formatDataColsDerivative([mockInitial[2]], queryClient, setExpandedRow)}/> )
    })
    afterEach(()=> jest.clearAllMocks()) 

    it("detects perps and treats them as expected", () => {
        const settlement = screen.getByText("--").closest("td");
        expect(within(settlement).getByText("--")).toBeInTheDocument(); 

 const slTp = screen.getByText("--/10%").closest("td");
        expect(within(slTp).getByText("--/10%")).toBeInTheDocument(); 
    })  
})
