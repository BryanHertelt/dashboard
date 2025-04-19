
import React from "react";
import '@testing-library/jest-dom'
import { render, screen, within, fireEvent, debug} from "@testing-library/react";
import AssetTableComponent from "../../src/utility/lib/build-components/asset-table-component";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dataColsCurrency, dataColsDerivative, dataColsNft } from "../../src/utility/lib/design-components/datatables/datatable-version-assetdistribution/asset-distribution-cols";
import { formatCurrency, formatValue } from "../../src/utility/lib/helpers/helper-functions";
import { LoadingSkeleton, ErrorSkeleton } from "../../src/utility/lib/datafetching/loading-skeleton";
import { ShowDetailIcon, SortingDataTableIcon, PositionDirectionIcon } from "../../public/images/icons";


class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.ResizeObserver = MockResizeObserver;

const mockPrefetch = jest.fn();
jest.mock("@/utility/lib/datafetching/client-refetch/prefetch-hooks", () => ({
  prefetchDetailComponent: (...args) => mockPrefetch(...args),
}));

jest.mock("../../src/utility/lib/design-components/datatables/table-layout/datatable-detail-popup", () => ({
  TableDetailComponent: () => <div test-id="mock-detail">Mock Detail Component</div>,
}));

jest.mock('../../src/utility/lib/datafetching/loading-skeleton', () => ({
  LoadingSkeleton: jest.fn().mockImplementation(() => (
    <div data-testid="loading-skeleton">Loading...</div>
  )),
}));

const queryClient = new QueryClient();
const renderWithClient = (ui) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

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
        "profitloss": 1000, 
        "profitlosschange": 20, 
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
      "profitloss": 1000, 
        "profitlosschange": 20, 
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
        "entry": 10,
        "unrealizedpl": -250,
        "price": 95,
        "liquidationprice": 85,
        "margin": 35,
        "tp": 10,
        "sl": null,
        "profitloss": 1000, 
        "profitlosschange": 20, 
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
      "profitloss": 1000, 
        "profitlosschange": 20, 
      "collectionfloorprice": 1200,
      "nftcount": 20,
      "notes": "Notes"
    }
 ]

 const tableConfig = {
    title: "Assets",
    initial: mockInitial,
    detail: true,
    statusFilter: "assettype",
    status: [
      {
        status: "cryptocurrency",
        statusTitle: "Currencies",
        columns: dataColsCurrency
      },
      {
        status: "nft",
        statusTitle: "NFTs",
        columns: dataColsNft
      },
      {
        status: "derivative",
        statusTitle: "Derivatives",
        columns: dataColsDerivative
      },
    ],
    filter: [
      {
        filter: "perp",
        filterTitle: "Perpetual",
        filterStatus: "derivative",
      },
      {
        filter: "future",
        filterTitle: "Future",
        filterStatus: "derivative",
      },
    ],
    currentValue: 1000,
  };


  describe("integration test with working config", () => {

    describe('tableStatus: cryptocurrency', () => {
      afterEach(()=> jest.clearAllMocks())
      beforeEach(()=>  renderWithClient(
        <AssetTableComponent config={tableConfig} />
      ) )

        it("renders the header", () => {
          expect(screen.getByText("Asset")).toBeInTheDocument()
          expect(screen.getByText("Value/Amount")).toBeInTheDocument()
          expect(screen.getByText("Percentage")).toBeInTheDocument()
          expect(screen.getByText("Change 24h")).toBeInTheDocument()
          expect(screen.getByText("P/L")).toBeInTheDocument()
          })
          it("renders the body", () => {
              const name = screen.getByText("Bitcoin").closest("td");
              expect(within(name).getByText("Bitcoin")).toBeInTheDocument(); 

            
          
              const amount = screen.getByText(mockInitial[0].assetamount).closest("td");
              expect(within(amount).getByText(mockInitial[0].assetamount)).toBeInTheDocument(); 
              
              const assetvalue  = screen.getByText(mockInitial[0].assetamount).closest("td");
              expect(within(assetvalue).getByText("$700,000.00")).toBeInTheDocument()
          
              const percentage = screen.getByText(`${mockInitial[0].assetpercentage}%`).closest("td");
              expect(within(percentage).getByText(`${mockInitial[0].assetpercentage}%`)).toBeInTheDocument(); 
            
              const change24 = screen.getByText(`${mockInitial[0].assetchange24h}%`).closest("td");
              expect(within(change24).getByText(`${mockInitial[0].assetchange24h}%`)).toBeInTheDocument(); 
          
              const profitloss = screen.getByText(formatCurrency(mockInitial[0].profitloss)).closest("td");
              expect(within(profitloss).getByText(formatCurrency(mockInitial[0].profitloss))).toBeInTheDocument(); 
              expect(within(profitloss).getByText(`(${formatValue(mockInitial[0].profitlosschange)}%)`)).toBeInTheDocument()
          
          })
      });

      describe("tableStatus: nft", () => {
        beforeEach(()=>{ 
          renderWithClient(
          <AssetTableComponent config={tableConfig} />
        )
        const nftButton =  screen.getByRole("button", {name: /NFTs/i}); 
        expect(nftButton).toBeInTheDocument()
        fireEvent.click(nftButton)

      })
        afterEach(()=> jest.clearAllMocks())
        it("renders header", () => {
          expect(screen.getByText("Collection")).toBeInTheDocument()
          expect(screen.getByText("Value")).toBeInTheDocument()
          expect(screen.getByText("Floor Price")).toBeInTheDocument()
          expect(screen.getByText("Amount")).toBeInTheDocument()
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
              });
      })

      describe("tableStatus: derivative", () => {
        beforeEach(()=>{ 
          renderWithClient(
          <AssetTableComponent config={tableConfig} />
        )
        const derivativeBtn =  screen.getByRole("button", {name: /Derivatives/i}); 
        expect(derivativeBtn).toBeInTheDocument()
        fireEvent.click(derivativeBtn)

      })
        afterEach(()=> jest.clearAllMocks())
              it("renders the header", () => {
                expect(screen.getByText("Symbol")).toBeInTheDocument()
                expect(screen.getByText("Entry")).toBeInTheDocument()
                expect(screen.getByText("Liq. Price")).toBeInTheDocument()
                expect(screen.getByText("Margin")).toBeInTheDocument()
                    })
                
                    it("renders the body", () => {

                      const checkItem = (item ) => {
                        const td = screen.getByText(item).closest("td")
                        expect(within(td).getByText(item)).toBeInTheDocument()
                      }
                
                      checkItem("BTCUSDT")
                      checkItem("LTCUSDT")
                      checkItem(formatCurrency(mockInitial[1].entry))
                      checkItem(formatCurrency(mockInitial[2].entry))
                      checkItem(formatCurrency(mockInitial[1].entry))
                      checkItem(formatCurrency(mockInitial[2].liquidationprice))
                      checkItem(formatCurrency(mockInitial[1].liquidationprice))
                      checkItem(formatCurrency(mockInitial[2].margin))
                      checkItem(formatCurrency(mockInitial[1].margin)) 
              
                    })

            describe("tableStatus: derivative/future", () => {
              
            })
      })
  })


