import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { BarChartRebalancing, HoldingBarChart } from "@/utility/lib/charts/bar-charts";
import { Bar } from "react-chartjs-2";

// --- Mocks ---
jest.mock("react-chartjs-2", () => ({
  Bar: jest.fn(() => null)
}));

jest.mock("../../src/utility/lib/helpers", () => ({
  formatValue: jest.fn((num) => Number(num).toFixed(2)),
  formatCurrency: jest.fn((num) => `$${Number(num).toLocaleString('en-US', { minimumFractionDigits: 2 })}`)
}));

// --- Test Data ---
const mockRebalancingData = {
  desiredbalance: 40,
  currentbalance: 30,
  desiredbalancenumber: 16000,
  currentbalancenumber: 12233
};

const mockHoldingData = [
  { name: "Binance", holdingdistribution: 45, currencyvalue: 75655.23 },
  { name: "Huobi", holdingdistribution: 3, currencyvalue: 10000 },
  { name: "Polygon", holdingdistribution: 5, currencyvalue: 80443.96 },
  { name: "Bybit", holdingdistribution: 4, currencyvalue: 10000 }
];

// --- Refactored BarChartRebalancing Tests ---
describe("BarChartRebalancing", () => {
  const setup = (data = mockRebalancingData) => 
    render(<BarChartRebalancing data={data} theme="details" />);

  beforeEach(() => jest.clearAllMocks());

  it("renders labels in the correct format", () => {
    setup();
    expect(screen.getByText(/Current: 30.00% ~ \$12,233.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Desired: 40.00% ~ \$16,000.00/i)).toBeInTheDocument();
  });

  it("calls Bar with the correct dataset and options", () => {
    setup();
    expect(Bar).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          datasets: [
            expect.objectContaining({ label: expect.stringContaining("Current"), data: [30] }),
            expect.objectContaining({ label: expect.stringContaining("Desired"), data: [40] })
          ]
        }),
        options: expect.objectContaining({ indexAxis: "y", scales: expect.any(Object) })
      }),
      expect.any(Object)
    );
  });

  it("shows setup message when desired balance is missing", () => {
    setup({ ...mockRebalancingData, desiredbalancenumber: null });
    expect(screen.getByText(/Set desired balancing to see your rebalancing statistics/i)).toBeInTheDocument();
  });
});

// --- Refactored HoldingBarChart Tests ---
describe("HoldingBarChart", () => {
  const setup = (data = mockHoldingData) =>
    render(<HoldingBarChart barData={data} />);

  beforeEach(() => jest.clearAllMocks());

  it("renders major labels and aggregates 'Other Holdings'", () => {
    setup();
    expect(screen.getByText(/Binance: 45.00% ~ \$75,655.23/i)).toBeInTheDocument();
    expect(screen.getByText(/Polygon: 5.00% ~ \$80,443.96/i)).toBeInTheDocument();
    // 3% (Huobi) + 4% (Bybit) = 7%
    expect(screen.getByText(/Other Holdings: 7.00% ~ \$20,000.00/i)).toBeInTheDocument();
  });

  it("renders only 'Other Holdings' if no main holdings (>5%) exist", () => {
    const minorData = [
      { name: "Huobi", holdingdistribution: 3, currencyvalue: 10000 },
      { name: "Bybit", holdingdistribution: 4, currencyvalue: 10000 }
    ];
    setup(minorData);
    
    expect(Bar).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          datasets: [expect.objectContaining({ label: expect.stringContaining("Other Holdings") })]
        })
      }),
      expect.any(Object)
    );
  });

  it("renders only specific assets if none fall under 'Other'", () => {
    const majorOnly = [{ name: "Binance", holdingdistribution: 45, currencyvalue: 75655.23 }];
    setup(majorOnly);

    expect(screen.queryByText(/Other Holdings/i)).not.toBeInTheDocument();
    expect(Bar).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          datasets: [expect.objectContaining({ label: expect.stringContaining("Binance") })]
        })
      }),
      expect.any(Object)
    );
  });

  it("renders error message when data is empty", () => {
    setup([]);
    expect(screen.getByText(/No chart data available/i)).toBeInTheDocument();
  });
});