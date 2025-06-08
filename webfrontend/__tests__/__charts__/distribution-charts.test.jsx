import { DistributionChart } from "../../src/utility/lib/charts/distribution-chart";
import { Chart } from "chart.js";
import { ranHexGen } from "../../src/utility/lib/helpers";
import { drawDoughnutChart } from "../../src/utility/lib/charts/drawDoughnutChart";
import { renderHoverLabel } from "../../src/utility/lib/charts/renderHoverLabel";
import { SmallErrorSkeleton } from "../../src/utility/lib/data-fetching";
import { render } from "@testing-library/react";
import { Doughnut } from "react-chartjs-2";
import { mockInitial } from "../testmocks";
import logger from "../../src/utility/lib/logging/logger";

jest.mock("react-chartjs-2", () => ({
  Doughnut: jest.fn().mockImplementation(() => <p>Doughnut Chart</p>)
}));

jest.mock("../../src/utility/lib/data-fetching", () => ({
  SmallErrorSkeleton: jest.fn().mockImplementation(() => <p>SmallErrorSkeleton</p>)
}));

jest.mock("../../src/utility/lib/charts/renderHoverLabel", () => ({
  renderHoverLabel: jest.fn().mockImplementation(() => null)
}));

jest.mock("../../src/utility/lib/charts/drawDoughnutChart", () => ({
  drawDoughnutChart: jest.fn().mockImplementation(() => null)
}));

jest.mock("../../src/utility/lib/helpers", () => ({
  ranHexGen: jest.fn().mockImplementation((count) => 
    Array(count).fill().map(() => "#cceeff")
  )
}));

jest.mock("../../src/utility/lib/logging/logger", () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn()
}));

describe("DistributionChart Component", () => {
  beforeEach(() => jest.clearAllMocks());

  const setUpTest = (total, assetData, full, tresholdValue, others = "Other Assets") => {
    const mockData = {
      total,
      pieData: assetData
    };
    render(<DistributionChart config={{ pieData: assetData, full, tresholdValue, total, others }} />);
  };

  it("calls Doughnut correctly", () => {
    setUpTest(1000, mockInitial, false, 10);
    expect(Doughnut).toHaveBeenCalled();
    expect(Doughnut).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalled();
  });

  it("handles empty data", () => {
    setUpTest(1000, [], false, 10);
    expect(SmallErrorSkeleton).toHaveBeenCalled();
    expect(SmallErrorSkeleton).toHaveBeenCalledTimes(1);
    expect(Doughnut).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      "distribution-chart.tsx >> Pie Data is undefined or empty",
      []
    );
  });

  it("correctly sets threshold and processes data", () => {
    const mockData = [
      { disElId: "1", disElVal: 500, disElName: "Asset A", disElDistribution: 50, disColor: "#cceeff" },
      { disElId: "2", disElVal: 300, disElName: "Asset B", disElDistribution: 30, disColor: "" },
      { disElId: "3", disElVal: 200, disElName: "Asset C", disElDistribution: 20, disColor: "#7A7A7A" }
    ];
    setUpTest(1000, mockData, false, 2);
    const mockCalls = Doughnut.mock.calls[0][0];
    const dataLength = mockCalls.data.datasets[0].data.length;
    const otherColors = mockCalls.data.datasets[0].backgroundColor[2];
    const mainColors = mockCalls.data.datasets[0].backgroundColor[0];
    const labels = mockCalls.data.labels;

    expect(labels).toEqual(["1", "2"]); 
    expect(dataLength).toBe(3);
    expect(mockCalls.data.datasets[0].data).toEqual([50, 30, 20]); 
    expect(mainColors).toEqual("#cceeff");
    expect(otherColors).toEqual("#7A7A7A"); 
  });

  it("correctly handles threshold edge cases", () => {
    const mockData = [
      { disElId: "1", disElVal: 500, disElName: "Asset A", disElDistribution: 50 },
      { disElId: "2", disElVal: 300, disElName: "Asset B", disElDistribution: 30 },
      { disElId: "3", disElVal: 200, disElName: "Asset C", disElDistribution: 20 }
    ];
    setUpTest(1000, mockData, false, 0);
    const mockCalls = Doughnut.mock.calls[0][0];
    expect(mockCalls.data.datasets[0].data.length).toBe(1); 
    expect(mockCalls.data.datasets[0].data).toEqual([100]); 
    expect(mockCalls.data.datasets[0].backgroundColor).toEqual(["#7A7A7A"]); 
    expect(mockCalls.data.labels).toEqual([]); 
  });

  it("correctly applies full range", () => {
    const mockData = [
      { disElId: "1", disElVal: 500, disElName: "Asset A", disElDistribution: 50 },
      { disElId: "2", disElVal: 300, disElName: "Asset B", disElDistribution: 30 },
      { disElId: "3", disElVal: 200, disElName: "Asset C", disElDistribution: 20 }
    ];
    setUpTest(1000, mockData, true, 3);
    const mockCalls = Doughnut.mock.calls[0][0];
    const realFormat = [mockCalls.options.circumference, mockCalls.options.rotation];
    const expectedFormat = [360, 0];

    expect(realFormat).toEqual(expectedFormat);
  });

  it("correctly calls hover-related functions", () => {
    const mockData = [
      { disElId: "1", disElVal: 500, disElName: "Asset A", disElDistribution: 50 },
      { disElId: "2", disElVal: 300, disElName: "Asset B", disElDistribution: 30 },
      { disElId: "3", disElVal: 200, disElName: "Asset C", disElDistribution: 20 }
    ];
    setUpTest(1000, mockData, false, 2);
    const mockCalls = Doughnut.mock.calls[0][0];
    expect(mockCalls.plugins).toHaveLength(1); 
    expect(mockCalls.options.onHover).toBeDefined(); 
  });
});