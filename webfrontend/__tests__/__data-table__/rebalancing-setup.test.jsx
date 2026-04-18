import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RebalancingSetUp } from '../../src/utility/lib/helpers/helper-components/rebalancing-set-up';
import { postRebalancing } from '../../src/utility/lib/data-fetching/layer';
import '@testing-library/jest-dom';

// ... (Mocks stay the same)

describe("Rebalancing SetUp - Integration & Unit", () => {
  const defaultProps = {
    data: { desiredbalance: 63.31, currentbalance: 36.69 },
    currentValue: 265550,
    assetId: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupComponent = (props = defaultProps) => {
    render(<RebalancingSetUp {...props} />);
    const percentageInput = screen.getByLabelText(/inputPercentage/i);
    const absoluteInput = screen.getByLabelText(/inputAbsolute/i);
    return { percentageInput, absoluteInput };
  };

  it("calculates initial absolute and percentage values correctly", () => {
    const { percentageInput, absoluteInput } = setupComponent();

    expect(screen.getByText(/Current: 36.69%/i)).toBeInTheDocument();
    expect(percentageInput).toHaveValue("63.00%");
    expect(absoluteInput).toHaveValue("$168,119.71");
  });

  it("updates absolute value when percentage changes", () => {
    const { percentageInput, absoluteInput } = setupComponent();

    // Focus to remove formatting, change, then blur
    fireEvent.click(percentageInput);
    fireEvent.change(percentageInput, { target: { value: '25' } });
    
    // Check if absolute input updated accordingly (25% of 265,550)
    expect(absoluteInput).toHaveValue("$66,387.50");
  });

  it("displays validation error when percentage exceeds 100%", () => {
    const { percentageInput } = setupComponent();

    fireEvent.click(percentageInput);
    fireEvent.change(percentageInput, { target: { value: '110' } });

    expect(screen.getByText(/cannot be larger than 100 percent/i)).toBeInTheDocument();
  });

  it("calls postRebalancing with formatted data on blur", async () => {
    const { percentageInput } = setupComponent();

    fireEvent.click(percentageInput);
    fireEvent.change(percentageInput, { target: { value: '23.456' } });
    fireEvent.blur(percentageInput);

    // Verify API call
    await waitFor(() => {
      expect(postRebalancing).toHaveBeenCalledWith(1, 23.46);
    });
  });

  describe("Edge Case: Null Data", () => {
    it("renders placeholder when desired balance is missing", () => {
      setupComponent({ ...defaultProps, data: { ...defaultProps.data, desiredbalance: null } });
      expect(screen.getByText(/Set desired balancing/i)).toBeInTheDocument();
    });
  });
});