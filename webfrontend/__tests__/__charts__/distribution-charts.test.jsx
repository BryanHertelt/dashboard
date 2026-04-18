import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import { DistributionChart } from "../../src/utility/lib/charts/distribution-chart";
import { SmallErrorSkeleton } from "../../src/utility/lib/data-fetching";
import { Doughnut } from "react-chartjs-2";
import { mockInitial } from "../testmocks";
import logger from "../../src/utility/lib/logging/logger";

// --- Mocks (Paths must match exactly what the Component imports) ---
jest.mock("react-chartjs-2", () => ({
  Doughnut: jest.fn(() => <p>Doughnut Chart</p>)
}));

jest.mock("../../src/utility/lib/data-fetching", () => ({
  SmallErrorSkeleton: jest.fn(() => <p>SmallErrorSkeleton</p>)
}));

jest.mock("../../src/utility/lib/charts/renderHoverLabel", () => ({
  renderHoverLabel: jest.fn()
}));

// Mocked without importing the variable to avoid "unused variable" errors
jest.mock("../../src/utility/lib/charts/drawDoughnutChart", () => ({
  drawDoughnutChart: jest.fn()
}));

jest.mock("../../src/utility/lib/helpers", () => ({
  ranHexGen: jest.fn((count) => Array(count).fill("#cceeff"))
}));

jest.mock("../../src/utility/lib/logging/logger", () => ({
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn()
}));

describe("DistributionChart Component", () => {
  beforeEach(() => jest.clearAllMocks());

  const setUpTest = (total, assetData, full, tresholdValue) => {
    return render(
      <DistributionChart 
        config={{ pieData: assetData, full, tresholdValue, total, others: "Other Assets" }} 
      />
    );
  };

  it("calls Doughnut correctly on success", () => {
    setUpTest(1000, mockInitial, false, 10);
    expect(Doughnut).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalled();
  });

  it("handles empty data by showing Error Skeleton", () => {
    setUpTest(1000, [], false, 10);
    expect(SmallErrorSkeleton).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Pie Data is undefined or empty"),
      []
    );
  });

  it("processes threshold and groups data correctly", () => {
    const mockData = [
      { disElId: "1", disElVal: 500, disElName: "A", disElDistribution: 50, disColor: "#cceeff" },
      { disElId: "2", disElVal: 300, disElName: "B", disElDistribution: 30, disColor: "" },
      { disElId: "3", disElVal: 200, disElName: "C", disElDistribution: 20, disColor: "#7A7A7A" }
    ];
    
    setUpTest(1000, mockData, false, 2);
    
    const props = Doughnut.mock.calls[0][0];
    expect(props.data.labels).toEqual(["1", "2"]); 
    expect(props.data.datasets[0].data).toEqual([50, 30, 20]);
    expect(props.data.datasets[0].backgroundColor[0]).toEqual("#cceeff");
    expect(props.data.datasets[0].backgroundColor[2]).toEqual("#EFEEF3"); 
  });
});