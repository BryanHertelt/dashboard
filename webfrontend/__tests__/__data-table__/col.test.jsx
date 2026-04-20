import { render, screen, within } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { DataTable } from '../../src/utility/lib/data-table/data-table';
import { dataColsCurrency, dataColsDerivative, dataColsNft } from '../../src/utility/lib/data-table/v-ad-cols/asset-distribution-cols';
import '@testing-library/jest-dom';

jest.mock("../../public/images/icons", () => ({
  PositionDirectionIcon: jest.fn(() => <span data-testid="position-direction-icon">P</span>),
  SortingDataTableIcon: jest.fn(() => <span>S</span>),
  ShowDetailIcon: jest.fn(({ rowId }) => <button data-testid={`toggle-${rowId}`}>+</button>),
}));

jest.mock("../../src/utility/lib/data-fetching/prefetch-hooks", () => ({
  prefetchDetailComponent: jest.fn(),
}));

jest.mock("../../src/utility/lib/data-table/table-detail-components/v-ad-assets-parent", () => ({
  TableDetailComponent: jest.fn(() => <div data-testid="mock-detail">Detail View</div>),
}));

jest.mock("../../src/utility/lib/data-fetching/skeletons/error-skeleton", () => ({
  SmallErrorSkeleton: jest.fn(() => <div>Error Skeleton</div>),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const setup = (data, columns, status) =>
  render(
    <QueryClientProvider client={queryClient}>
      <DataTable
        data={data}
        columns={columns}
        currentValue={1}
        tableStatus={status}
        expandedRow={null}
        setExpandedRow={() => {}}
      />
    </QueryClientProvider>
  );

// --- Test Data ---
const cryptodata = [
  {
    symbol: "A", assettype: "cryptocurrency", assetid: 1,
    assetname: "Bitcoin", assetabbreviation: "BTC",
    assetamount: 0.5, distribution: 5, assetvalue: 486953,
    assetchange24h: 5, profitloss: 486953, profitlosschange: 20,
  },
  {
    symbol: "A", assettype: "cryptocurrency", assetid: 2,
    assetname: "Ethereum", assetabbreviation: "ETH",
    assetamount: 2, distribution: -3, assetvalue: 72000,
    assetchange24h: 2, profitloss: 100, profitlosschange: 5,
  },
];

const nftdata = [
  {
    symbol: "B", assettype: "nft", assetid: 312,
    assetname: "Moonbirds", collectionvalue: 1200,
    collectionfloorprice: 1200, collectionvalueeth: 1,
    assetamount: 5, distribution: 3,
    profitloss: 100, profitlosschange: 10,
  },
];

const derivativedata = [
  {
    symbol: "C", assettype: "derivative", assetid: 12,
    assetname: "BTCUSDT", derivativeexchange: "Bybit",
    positiontype: "open", tradedirection: "long",
    derivativetype: "future", leverage: 5,
    assetvalue: 15000, size: 15000, entry: 30000,
    unrealizedpl: 2500, price: 32000,
    liquidationprice: 25000, margin: 100,
    tp: 3, sl: 29, distribution: 3,
    profitloss: 1000, profitlosschange: 26,
  },
];

describe("DataTable Integration: Semantic Rendering", () => {
  afterEach(() => jest.clearAllMocks());

  describe("Cryptocurrency Strategy", () => {
    it("verifies row data and color-coding without Node traversal", () => {
      setup(cryptodata, dataColsCurrency, "cryptocurrency");

      const row = screen.getByRole("row", { name: /bitcoin/i });
      const { getByText } = within(row);

      expect(getByText("Bitcoin")).toBeInTheDocument();
      expect(getByText("BTC")).toBeInTheDocument();

      expect(within(row).getAllByText("$486,953.00")[1]).toHaveClass("text-green");
      const greenPercentEl = within(row).getAllByText("5.00 %").find(el => el.parentElement?.className.includes("text-green"));
      expect(greenPercentEl?.parentElement).toHaveClass("text-green");
    });

    it("handles negative crypto data styling", () => {
      const negativeData = [{ ...cryptodata[1], assetchange24h: -4, profitloss: -100 }];
      setup(negativeData, dataColsCurrency, "cryptocurrency");

      const row = screen.getByRole("row", { name: /ethereum/i });
      const { getByText } = within(row); 

      expect(screen.getByText("4.00 %").parentElement).toHaveClass("text-red");
      expect(getByText("$100.00")).toHaveClass("text-red");
    });
  });

  describe("NFT Strategy", () => {
    it("validates NFT row contents", () => {
      setup(nftdata, dataColsNft, "nft");

      const row = screen.getByRole("row", { name: /moonbirds/i });
      const rowScope = within(row);

      expect(rowScope.getByText("Moonbirds")).toBeInTheDocument();
      expect(rowScope.getByText("1.00 ETH")).toBeInTheDocument();
    });
  });

  describe("Derivative Strategy", () => {
    it("validates complex derivative cell logic", () => {
      setup(derivativedata, dataColsDerivative, "derivatives");

      const row = screen.getByRole("row", { name: /btcusdt/i });
      const { getByText, getByTestId } = within(row);

      expect(getByText("x5")).toBeInTheDocument();
      expect(getByText("C Bybit")).toBeInTheDocument();

      expect(getByTestId("position-direction-icon")).toBeInTheDocument();
    });
  });
});
