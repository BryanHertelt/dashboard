import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { LineChartComponent } from "../../src/utility/lib/charts/line-charts"
import { Line } from 'react-chartjs-2'

// --- Mocks ---
jest.mock("../../src/utility/lib/helpers", () => ({
  formatValue: jest.fn((n) => Number(n).toFixed(2)),
  formatCurrency: jest.fn((n) => `$${Number(n).toFixed(2)}`)
}))

jest.mock("react-chartjs-2", () => ({
  Line: jest.fn(() => null)
}))

// --- Test Data ---
const portfolioQuery = [
  { "x": "2025-01-17T10:05:00.000Z", "y": [174, 174] },
  { "x": "2025-01-17T10:10:00.000Z", "y": [520, 520] },
]

const devQuery = [
  { "x": "2025-01-16T23:00:00.000Z", "y": [12, 14, 7] },
  { "x": "2025-01-16T23:10:00.000Z", "y": [18, 19, 5] },
]

const dropDownMenuValues = [
  { timeframe: "1 day", timeunit: "hour" },
  { timeframe: "7 days", timeunit: "day" },
  { timeframe: "1 month", timeunit: "day" },
  // ... rest of your timeframes
];

// --- Refactored Setup & Assertion Helper ---
const validateLineChart = (expectedData) => {
  expect(Line).toHaveBeenLastCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        datasets: expect.arrayContaining([
          expect.objectContaining({ label: expectedData.labelFirst, data: expectedData.dataP }),
          expect.objectContaining({ label: expectedData.labelScnd, data: expectedData.dataScnd }),
          expect.objectContaining({ label: expectedData.labelThd, data: expectedData.dataThd }),
        ]),
      })
    }),
    expect.any(Object)
  );
};

const runTimeframeSuite = (props, expectedResult) => {
  dropDownMenuValues.forEach(({ timeframe, timeunit }) => {
    render(
      <LineChartComponent
        {...props}
        timeframe={{ timeframe, timeunit }}
      />
    );
    validateLineChart(expectedResult);
  });
};

describe("LineChartComponent", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("scope: portfoliotimeframes", () => {
    const defaultProps = {
      processedQueryData: portfolioQuery,
      scope: "portfoliotimeframes"
    };

    it("renders correctly with no comparators", () => {
      const expected = {
        labelFirst: "networth", labelScnd: "invest", labelThd: "change",
        dataP: [174, 520], dataScnd: null, dataThd: null
      };
      runTimeframeSuite({ ...defaultProps, comparators: { costbasis: false, btc: false, eth: false } }, expected);
    });

    it("renders correctly with costbasis enabled", () => {
      const expected = {
        labelFirst: "networth", labelScnd: "invest", labelThd: "change",
        dataP: [174, 520], dataScnd: [174, 520], dataThd: null
      };
      runTimeframeSuite({ ...defaultProps, comparators: { costbasis: true, btc: false, eth: false } }, expected);
    });
  });

  describe("scope: development", () => {
    const defaultProps = {
      processedQueryData: devQuery,
      scope: "development"
    };

    it("renders correctly with btc enabled", () => {
      const expected = {
        labelFirst: "change", labelScnd: "change", labelThd: "change",
        dataP: [12, 18], dataScnd: [14, 19], dataThd: null
      };
      runTimeframeSuite({ ...defaultProps, comparators: { costbasis: false, btc: true, eth: false } }, expected);
    });

    it("renders correctly with eth enabled", () => {
      const expected = {
        labelFirst: "change", labelScnd: "change", labelThd: "change",
        dataP: [12, 18], dataScnd: null, dataThd: [7, 5]
      };
      runTimeframeSuite({ ...defaultProps, comparators: { costbasis: false, btc: false, eth: true } }, expected);
    });

    it("renders correctly with both btc and eth enabled", () => {
      const expected = {
        labelFirst: "change", labelScnd: "change", labelThd: "change",
        dataP: [12, 18], dataScnd: [14, 19], dataThd: [7, 5]
      };
      runTimeframeSuite({ ...defaultProps, comparators: { costbasis: false, btc: true, eth: true } }, expected);
    });

    it("ignores costbasis in development scope", () => {
      const expected = {
        labelFirst: "change", labelScnd: "change", labelThd: "change",
        dataP: [12, 18], dataScnd: [14, 19], dataThd: [7, 5]
      };
      // costbasis: true should not change labels to 'networth'/'invest'
      runTimeframeSuite({ ...defaultProps, comparators: { costbasis: true, btc: true, eth: true } }, expected);
    });
  });

  describe("Edge Cases", () => {
    it("handles missing props by falling back to defaults", () => {
      const expected = {
        labelFirst: "networth", labelScnd: "invest", labelThd: "change",
        dataP: [174, 520], dataScnd: null, dataThd: null
      };
      
      // We don't use the suite here to test specifically for undefined behavior
      render(<LineChartComponent processedQueryData={portfolioQuery} />);
      validateLineChart(expected);
    });
  });
});