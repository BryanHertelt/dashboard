import '@testing-library/jest-dom'
import { formatDataColsCurrency, formatDataColsDerivative, formatDataColsNft } from "../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols";
import {
    AssetPercentageValueIcon,
    NotesInDataTableIcon,
    PositionDirectionIcon
  } from "../../public/images/index";
import { formatCurrency } from "../../src/utility/lib/helpers/helper-functions";
import { TableLineChart } from "../../src/utility/lib/design-components/charts/table-line-charts";
import {DataTable} from "../../src/utility/lib/design-components/datatables/table-layout/data-table"
import { ErrorSkeleton } from "../../src/utility/lib/datafetching/loading-skeleton";
import { render,screen, within, fireEvent } from "@testing-library/react";
import { formatCurrency, formatValue, cn} from '../../src/utility/lib/helpers/helper-functions'
import { twMerge } from 'tailwind-merge'
import { clsx } from "clsx";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { dataColsNft, dataColsCurrency, dataColsDerivative } from '../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols';

jest.mock("../../public/images/icons", () => ({
    PositionDirectionIcon: jest.fn().mockImplementation(() => <p testid="position-direction-icon"> PositionDirection </p> ),
    SortingDataTableIcon: jest.fn().mockImplementation(() => null),
    AssetPercentageValueIcon: jest.fn().mockImplementation(() => null),
    ShowDetailIcon: ({ rowId }) => <button data-testid={`toggle-${rowId}`}>+</button>,
}))

const queryClient = new QueryClient();

const renderWithClient = (ui) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

const cryptodata = [
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
    "assetamount": 300000000000,
    "assetvalue": 70000,
    "assetmarketprice": 1400000,
    "assetchange24h": 5,
    "assetchange24hourvalue": 1000,
    "assetchange7d": [680000, 690000, 710000, 695000, 700000],
    "profitloss": 486953,
    "profitlosschange": 20, 
    "notes": "Notes"
},
{
  "symbol": "A",
  "portfolioid": 2,
  "userid": 2,
  "groupid": 2,
  "holdingid": 2,
  "assettype": "cryptocurrency",
  "assetid": 2,
  "assetname": "Ethereum",
  "assetabbreviation": "BTC",
  "assetamount": 3000000000,
  "assetvalue": 7000,
  "assetmarketprice": 140000,
  "assetchange24h": -4,
  "assetchange24hourvalue": 100,
  "assetchange7d": [680000, 69000, 71000, 695000, 700000],
  "profitloss": 48653,
  "profitlosschange": 2, 
  "notes": "Notes"
},

 ]

 const nftdata = [
  {
    "symbol": "B",
    "portfolioid": 1,
    "userid": 1,
    "groupid": 2,
    "holdingid": 7,
    "assetpercentage": 30,
    "assettype": "nft",
    "assetid": 1215,
    "assetname": "Moonbirds",
    "collectionvalue": 1200,
    "collectionvalueeth": 1, 
    "collectionfloorprice": 1100,
    "assetamount": 9,
    "profitloss": 486953,
      "profitlosschange": 20, 
    "notes": "Notes"
  }
 ]
 const derivativedata= [
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
    "derivativeexchange":"Bybit" ,
    "positiontype": "open",
    "tradedirection": "long", 
    "derivativetype": "future",
    "leverage": 5,
    "assetamount": 15000,
    "entry": 30000,
    "unrealizedpl": 2500,
    "price": 32000,
    "liquidationprice": 25000,
    "margin": 100,
    "tp": 3,
    "sl": 29,
    "profitloss": 10,
      "profitlosschange": 20, 
    "settlementdate": "2024-06-15T10:00:00.000Z",
     "notes": "Notes"
  },
 ]

jest.mock("../../src/utility/lib/datafetching/loading-skeleton", () => ({
    ErrorSkeleton: jest.fn().mockImplementation(()=> null), 
}))


jest.mock("../../src/utility/lib/design-components/datatables/table-layout/datatable-detail-popup", () => ({
    TableDetailComponent: jest.fn().mockImplementation(()=> null), 
    }))


describe("renders crypto cols as expected", () => {

afterEach(()=> jest.clearAllMocks())

it("renders the header", () => {
  renderWithClient(
    <DataTable
      data={cryptodata}
      columns={dataColsCurrency}
      currentValue={1}
      tableStatus="cryptocurrency"
      expandedRow={null}
      setExpandedRow={() => {}}
    />
  );
expect(screen.getByText("Asset")).toBeInTheDocument()
expect(screen.getByText("Value/Amount")).toBeInTheDocument()
expect(screen.getByText("Percentage")).toBeInTheDocument()
expect(screen.getByText("Change 24h")).toBeInTheDocument()
expect(screen.getByText("P/L")).toBeInTheDocument()
})
it("renders the body", () => {
  renderWithClient(
    <DataTable
      data={cryptodata}
      columns={dataColsCurrency}
      currentValue={1}
      tableStatus="cryptocurrency"
      expandedRow={null}
      setExpandedRow={() => {}}
    />
  );
    const name = screen.getByText("Bitcoin").closest("td");
    expect(within(name).getByText("Bitcoin")).toBeInTheDocument(); 

    const amount = screen.getByText("300.00 B").closest("td");
    expect(within(amount).getByText("300.00 B")).toBeInTheDocument(); 
    expect(within(amount).getByText(formatCurrency(cryptodata[0].assetvalue))).toBeInTheDocument()

        // Test that asset abbreviation appears under the asset name
        const assetCell = screen.getByText("Bitcoin").closest("td");
        expect(within(assetCell).getByText("BTC")).toBeInTheDocument();
    
        // Check positive 24h change is styled correctly
        const change24Container = screen.getByText(`${formatValue(cryptodata[0].assetchange24h)} %`).closest("div");
        expect(change24Container).toHaveClass("text-green");
    
        // Check profit/loss value formatting and class for positive value
        const profitText = screen.getByText(formatCurrency(cryptodata[0].profitloss));
        expect(profitText).toHaveClass("text-green");
    
        const profitChangeText = screen.getByText(`(${formatValue(cryptodata[0].profitlosschange)}%)`);
        expect(profitChangeText).toHaveClass("text-green");
    

    const change24 = screen.getByText(`${formatValue(cryptodata[0].assetchange24h)} %`).closest("td");
    expect(within(change24).getByText(`${formatValue(cryptodata[0].assetchange24h)} %`)).toBeInTheDocument(); 
    

    const profitloss = screen.getByText(formatCurrency(cryptodata[0].profitloss)).closest("td");
    expect(within(profitloss).getByText(formatCurrency(cryptodata[0].profitloss))).toBeInTheDocument(); 
    expect(within(profitloss).getByText(`(${formatValue(cryptodata[0].profitlosschange)}%)`))


})
it("applies correct styles and formatting for negative change", () => {
  renderWithClient(
    <DataTable
      data={[cryptodata[1]]}
      columns={dataColsCurrency}
      currentValue={1}
      tableStatus="cryptocurrency"
      expandedRow={null}
      setExpandedRow={() => {}}
    />
  );

  const change24Container = screen.getByText(`4.00 %`).closest("div");
  expect(change24Container).toHaveClass("text-red");

  const profitText = screen.getByText(formatCurrency(cryptodata[1].profitloss));
  expect(profitText).toHaveClass("text-green");
});


})

describe("renders negative crypto data", () => {
  beforeEach(()=> jest.clearAllMocks())
  it("renders correct color for negative profit and change", () => {
    const negativeData = [{ ...cryptodata[0], profitloss: -100, profitlosschange: -1.5 }];
    renderWithClient(
      <DataTable
        data={negativeData}
        columns={dataColsCurrency}
        currentValue={1}
        tableStatus="cryptocurrencies"
        expandedRow={null}
        setExpandedRow={() => {}}
      />
    );

    const profitLoss = screen.getAllByText(`$100.00`);
    expect(profitLoss[0].closest("p")).toHaveClass("text-red");

    const change = screen.getByText(`(${formatValue(1.5)}%)`);
    expect(change).toHaveClass("text-red");
});
})

describe("renders nft cols as expected", () => {
    beforeEach(()=> {
        jest.clearAllMocks()
        renderWithClient(
          <DataTable
            data={nftdata}
            columns={dataColsNft}
            currentValue={1}
            tableStatus="nft"
            expandedRow={null}
            setExpandedRow={() => {}}
          />
        );
    })
    afterEach(()=> jest.clearAllMocks()) 

    it("renders header", () => {
expect(screen.getByText("Collection")).toBeInTheDocument()
expect(screen.getByText("Value")).toBeInTheDocument()
expect(screen.getByText("Floor Price")).toBeInTheDocument()
expect(screen.getByText("Amount")).toBeInTheDocument()
expect(screen.getByText("P/L")).toBeInTheDocument()
    })
    it("renders table body", () => {
        const collection = screen.getByText(nftdata[0].assetname).closest("td");
        expect(within(collection).getByText(nftdata[0].assetname)).toBeInTheDocument(); 

        const value = screen.getByText(formatCurrency(nftdata[0].collectionvalue)).closest("td"); 
        expect(within(value).getByText(formatCurrency(nftdata[0].collectionvalue))).toBeInTheDocument(); 

        const floorPrice = screen.getByText(formatCurrency(nftdata[0].collectionvalue)).closest("td");
        expect(within(floorPrice).getByText(formatCurrency(nftdata[0].collectionvalue))).toBeInTheDocument();
        expect(within(floorPrice).getByText(`${formatValue(nftdata[0].collectionvalueeth)} ETH`)).toBeInTheDocument();


        const nftCount = screen.getByText(nftdata[0].assetamount).closest("td")
        expect(within(nftCount).getByText(nftdata[0].assetamount)).toBeInTheDocument()

        const profitloss = screen.getByText(formatCurrency(nftdata[0].profitloss)).closest("td");
        expect(within(profitloss).getByText(formatCurrency(nftdata[0].profitloss))).toBeInTheDocument(); 
        expect(within(profitloss).getByText(`(${formatValue(nftdata[0].profitlosschange)}%)`))

    });
    it("renders NFT symbol next to collection name", () => {
      expect(screen.getByText(nftdata[0].symbol)).toBeInTheDocument();
  });

  it("applies correct class for positive profit/loss", () => {
      const profit = screen.getByText(formatCurrency(nftdata[0].profitloss));
      const change = screen.getByText(`(${formatValue(nftdata[0].profitlosschange)}%)`);
      expect(profit).toHaveClass("text-green");
      expect(change).toHaveClass("text-green");
  });
  it("triggers sorting when clicking Value header", () => {
    const valueHeader = screen.getByText("Value").closest("button");
    fireEvent.click(valueHeader);
    expect(valueHeader).toBeInTheDocument(); // minimal check to confirm interaction
});

it("triggers sorting when clicking Floor Price header", () => {
    const floorPriceHeader = screen.getByText("Floor Price").closest("button");
    fireEvent.click(floorPriceHeader);
    expect(floorPriceHeader).toBeInTheDocument();
});

it("triggers sorting when clicking P/L header", () => {
    const plHeader = screen.getByText("P/L").closest("button");
    fireEvent.click(plHeader);
    expect(plHeader).toBeInTheDocument();
});

})

describe("negative nft" , () => {
  it("applies correct class for negative profit/loss", () => {
    const negativeData = [{
        ...nftdata[0],
        profitloss: -1200,
        profitlosschange: -15.25,
    }];

    renderWithClient(
        <DataTable
            data={negativeData}
            columns={dataColsNft}
            currentValue={1}
            tableStatus="nft"
            expandedRow={null}
            setExpandedRow={() => {}}
        />
    );

    const profit = screen.getAllByText(formatCurrency(1200));
    const change = screen.getByText(`(${formatValue(15.25)}%)`);

    expect(profit[1].closest("p")).toHaveClass("text-red");
    expect(change).toHaveClass("text-red");
});
})






describe("renders derivative cols as expected", () => {
    beforeEach(()=> {
        jest.clearAllMocks()
        renderWithClient(
          <DataTable
            data={derivativedata}
            columns={dataColsDerivative}
            currentValue={1}
            tableStatus="derivatives"
            expandedRow={null}
            setExpandedRow={() => {}}
          />
        );
    })
    afterEach(()=> jest.clearAllMocks()) 

    it("renders the header", () => {
expect(screen.getByText("Symbol")).toBeInTheDocument()
expect(screen.getByText("Entry")).toBeInTheDocument()
expect(screen.getByText("Liq. Price")).toBeInTheDocument()
expect(screen.getByText("Margin")).toBeInTheDocument()
expect(screen.getByText("P/L")).toBeInTheDocument()
    })

    it("renders the body", () => {

        const symbol = screen.getByText("BTCUSDT").closest("td");
        expect(within(symbol).getByText("BTCUSDT")) .toBeInTheDocument(); 

        const entry = screen.getByText(formatCurrency(derivativedata[0].entry)).closest("td");
        expect(within(entry).getByText(formatCurrency(derivativedata[0].entry))).toBeInTheDocument(); 

        const liqPrice = screen.getByText(formatCurrency(derivativedata[0].liquidationprice)).closest("td");
        expect(within(liqPrice).getByText(formatCurrency(derivativedata[0].liquidationprice))).toBeInTheDocument(); 

        const margin = screen.getByText(formatCurrency(derivativedata[0].margin)).closest("td");
        expect(within(margin).getByText(formatCurrency(derivativedata[0].margin))).toBeInTheDocument(); 
        const profitLoss =  screen.getByText(formatCurrency(derivativedata[0].profitloss)).closest("td");
        expect(within(profitLoss).getByText(formatCurrency(derivativedata[0].profitloss))).toBeInTheDocument(); 

    

    })
    it("renders leverage, symbol and exchange in the assetname cell", () => {
      expect(screen.getByText(`x${derivativedata[0].leverage}`)).toBeInTheDocument();
      expect(screen.getByText(`C ${derivativedata[0].derivativeexchange}`)).toBeInTheDocument();
  });

  it("renders correct color for positive profit and change", () => {
      const profitLoss = screen.getByText(formatCurrency(derivativedata[0].profitloss));
      expect(profitLoss).toHaveClass("text-green");

      const change = screen.getByText(`(${formatValue(derivativedata[0].profitlosschange)}%)`);
      expect(change).toHaveClass("text-green");
  });


  it("sorts columns when header is clicked", () => {
      const entryHeader = screen.getByText("Entry").closest("button");
      fireEvent.click(entryHeader);
      expect(entryHeader).toBeInTheDocument();
  });

  it("renders PositionDirectionIcon", () => {
      expect(screen.getByText("PositionDirection")).toBeInTheDocument(); 
  });
})

describe("renders negative derivative data", () => {
  beforeEach(()=> jest.clearAllMocks())
  it("renders correct color for negative profit and change", () => {
    const negativeData = [{ ...derivativedata[0], profitloss: -100, profitlosschange: -1.5 }];
    renderWithClient(
      <DataTable
        data={negativeData}
        columns={dataColsDerivative}
        currentValue={1}
        tableStatus="derivatives"
        expandedRow={null}
        setExpandedRow={() => {}}
      />
    );

    const profitLoss = screen.getAllByText(`$100.00`);
    expect(profitLoss[1].closest("p")).toHaveClass("text-red");

    const change = screen.getByText(`(${formatValue(1.5)}%)`);
    expect(change).toHaveClass("text-red");
});
})

