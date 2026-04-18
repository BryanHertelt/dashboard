import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import AssetValueChartComponent from "../../src/utility/lib/build-components/value-chart-comp"
import { LineChartComponent } from "../../src/utility/lib/design-components/charts/line-charts";
import { useValueChart } from "../../src/utility/lib/datafetching/client-refetch/client-hooks";
import { LoadingSkeleton, ErrorSkeleton } from "../../src/utility/lib/datafetching/loading-skeleton"

// --- Mocks ---
jest.mock("../../src/utility/lib/helpers/helper-functions", () => ({
  formatCurrency: jest.fn((num) => `$${Number(num).toFixed(2)}`)
}))

jest.mock("../../src/utility/lib/design-components/charts/line-charts", () => ({
  LineChartComponent: jest.fn(() => null)
}))

jest.mock("../../src/utility/lib/datafetching/client-refetch/client-hooks", () => ({
  useValueChart: jest.fn()
}))

jest.mock("../../public/images/index", () => ({
  BitcoinIcon: () => <span>BitcoinIcon</span>,
  EthereumIcon: () => <span>EthereumIcon</span>,
}))

jest.mock("../../src/utility/lib/datafetching/loading-skeleton", () => ({
  LoadingSkeleton: jest.fn(() => null),
  ErrorSkeleton: jest.fn(() => null)
}))

// --- Test Constants ---
const mockSevenDays = [{ "x": "2025-01-16T00:00:00.000Z", "y": [1304, 100] }];
const queryMock = [{ "x": "2025-01-16T00:00:00.000Z", "y": [1304, 100] }];
const importantElements = ["BitcoinIcon", "EthereumIcon", "Cost Basis", "Assets", "7d", "My Assets", "$50.00"];

const dropDownMenuValues = [
  { timeframe: "1 day", timeunit: "hour" },
  { timeframe: "7 days", timeunit: "day" },
  { timeframe: "1 month", timeunit: "day" },
];

// --- Refactored Setup Helper ---
const setup = (hookOverrides = {}, propsOverrides = {}) => {
  const defaultHook = { processedQueryData: queryMock, isLoading: false, isError: false, ...hookOverrides };
  useValueChart.mockReturnValue(defaultHook);
  
  const props = { initialData: mockSevenDays, currentValue: 50, ...propsOverrides };
  const utils = render(<AssetValueChartComponent {...props} />);
  
  return { ...utils };
};

describe("AssetValueChartComponent", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders all core UI elements on success", () => {
    setup();
    importantElements.forEach(el => expect(screen.getByText(el)).toBeInTheDocument());
  });

  it("handles 'Cost Basis' interaction", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Cost Basis/i }));
    
    expect(LineChartComponent).toHaveBeenCalledTimes(2); // Initial + Click
    expect(LineChartComponent).toHaveBeenLastCalledWith(
      expect.objectContaining({ comparators: { costbasis: true, btc: false, eth: false } }),
      expect.any(Object)
    );
    expect(screen.getAllByText("Cost Basis")).toHaveLength(2);
  });

  // Combined Asset Selection Tests
  const assetTests = [
    { name: "BitcoinIcon", text: "Bitcoin ≈", match: { btc: true, eth: false, costbasis: false } },
    { name: "EthereumIcon", text: "Ethereum ≈", match: { btc: false, eth: true, costbasis: false } }
  ];

  assetTests.forEach(({ name, text, match }) => {
    it(`updates chart when clicking ${name}`, () => {
      setup();
      fireEvent.click(screen.getByRole("button", { name: new RegExp(name, 'i') }));
      
      expect(LineChartComponent).toHaveBeenLastCalledWith(
        expect.objectContaining({ comparators: match }),
        expect.any(Object)
      );
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("handles multi-asset selection (BTC + ETH)", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /BitcoinIcon/i }));
    fireEvent.click(screen.getByRole("button", { name: /EthereumIcon/i }));

    expect(LineChartComponent).toHaveBeenCalledTimes(3);
    expect(screen.getByText("Bitcoin ≈")).toBeInTheDocument();
    expect(screen.getByText("Ethereum ≈")).toBeInTheDocument();
  });

  // Combined Status Tests (Loading / Error)
  const statusCases = [
    { desc: "Loading", hook: { isLoading: true }, expected: LoadingSkeleton },
    { desc: "Error", hook: { isError: true }, expected: ErrorSkeleton }
  ];

  statusCases.forEach(({ desc, hook, expected }) => {
    it(`renders ${desc} state correctly`, () => {
      setup(hook);
      expect(expected).toHaveBeenCalled();
      expect(LineChartComponent).not.toHaveBeenCalled();
    });
  });

  it("switches timeframes correctly via dropdown", () => {
    setup();
    dropDownMenuValues.forEach(({ timeframe, timeunit }) => {
      const btn = screen.getByRole("button", { name: new RegExp(timeframe, 'i') });
      fireEvent.click(btn);
      
      expect(LineChartComponent).toHaveBeenLastCalledWith(
        expect.objectContaining({ timeframe: { timeframe, timeunit } }),
        expect.any(Object)
      );
    });
  });
});