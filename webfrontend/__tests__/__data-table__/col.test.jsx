import { render, screen, within } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { DataTable } from '../../src/utility/lib/data-table/data-table';
import { dataColsCurrency, dataColsDerivative, dataColsNft } from '../../src/utility/lib/data-table/v-ad-cols/asset-distribution-cols';
import '@testing-library/jest-dom';

const queryClient = new QueryClient();

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

describe("DataTable Integration: Semantic Rendering", () => {
  afterEach(() => jest.clearAllMocks());

  describe("Cryptocurrency Strategy", () => {
    it("verifies row data and color-coding without Node traversal", () => {
      setup(cryptodata, dataColsCurrency, "cryptocurrency");

      // Target the row by the accessible name (the text content of the row)
      const row = screen.getByRole("row", { name: /bitcoin/i });
      const { getByText } = within(row);

      // Verify text presence
      expect(getByText("Bitcoin")).toBeInTheDocument();
      expect(getByText("BTC")).toBeInTheDocument();

      // Verify styling: 
      // If the class is on the element with the text, this works:
      expect(getByText("$486,953.00")).toHaveClass("text-green");

      // If the class is on a wrapper, use a test-id or more specific selector
      // In this case, we check the specific numeric value string for the class
      expect(getByText("5.00 %")).toHaveClass("text-green");
    });

    it("handles negative crypto data styling", () => {
      const negativeData = [{ ...cryptodata[1], assetchange24h: -4, profitloss: -100 }];
      setup(negativeData, dataColsCurrency, "cryptocurrency");

      const row = screen.getByRole("row", { name: /ethereum/i });
      const { getByText } = within(row);

      // We assert directly on the text element's class
      expect(getByText("4.00 %")).toHaveClass("text-red");
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
      
      // Using the data-testid we defined in our icon mock earlier
      expect(getByTestId("position-direction-icon")).toBeInTheDocument();
    });
  });
});