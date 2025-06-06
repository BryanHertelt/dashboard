import { drawDoughnutChart } from "../../src/utility/lib/charts/drawDoughnutChart";

describe('drawDoughnutChart', () => {
  // Mock references for selectedDatasetIndex and selectedIndex
  const selectedDatasetIndex = { current: null };
  const selectedIndex = { current: null };
  
  // Mock chart object with a draw method
  const mockChart = {
    draw: jest.fn().mockImplementation(() => null)
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    selectedDatasetIndex.current = null;
    selectedIndex.current = null;
  });

  test('should update indices and call chart.draw when element[0] exists and index changes', () => {
    const mockElement = [{ datasetIndex: 1, index: 2 }];
    drawDoughnutChart({}, mockElement, mockChart, selectedDatasetIndex, selectedIndex);
    
    expect(selectedDatasetIndex.current).toBe(1);
    expect(selectedIndex.current).toBe(2);
  });

  test('should not call chart.draw when element[0] exists but index does not change', () => {
    selectedIndex.current = 2; // Pre-set to same value
    const mockElement = [{ datasetIndex: 1, index: 2 }];
    drawDoughnutChart({}, mockElement, mockChart, selectedDatasetIndex, selectedIndex);
    
    expect(selectedDatasetIndex.current).toBe(1);
    expect(selectedIndex.current).toBe(2);
    expect(mockChart.draw).not.toHaveBeenCalled();
  });

  test('should reset indices and call chart.draw when element[0] does not exist', () => {
    drawDoughnutChart({}, [], mockChart, selectedDatasetIndex, selectedIndex);
    
    expect(selectedDatasetIndex.current).toBeNull();
    expect(selectedIndex.current).toBeNull();
    expect(mockChart.draw).toHaveBeenCalledTimes(1);
  });

  test('should handle empty element array correctly', () => {
    drawDoughnutChart({}, [], mockChart, selectedDatasetIndex, selectedIndex);
    
    expect(selectedDatasetIndex.current).toBeNull();
    expect(selectedIndex.current).toBeNull();
    expect(mockChart.draw).toHaveBeenCalledTimes(1);
  });
});