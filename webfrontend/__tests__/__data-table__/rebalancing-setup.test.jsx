import '@testing-library/jest-dom'
import { RebalancingSetUp } from '../../src/utility/lib/helpers/helper-components/rebalancing-set-up';
import { formatCurrency } from '../../src/utility/lib/helpers/helper-functions/formatCurrency';
import { formatValue } from '../../src/utility/lib/helpers/helper-functions/formatValue';
import { Bar } from 'react-chartjs-2';
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react"
import { postRebalancing } from '../../src/utility/lib/data-fetching/layer';

jest.mock("react-chartjs-2", () => ({
    Bar: jest.fn().mockImplementation(() => <p> Bar Chart </p>) 
}))
jest.mock('../../src/utility/lib/data-fetching/layer', () => ({
    postRebalancing: jest.fn().mockImplementation(null)
}))
let mockInitial = {
    desiredbalance: 63.31, 
    currentbalance: 36.69
}

let currentValue = 265550
let assetId = 1 

const setUp = () => {
    const percentageInput = screen.getByLabelText('inputPercentage');
    const absoluteInput = screen.getByLabelText('inputAbsolute');
    return {percentageInput, absoluteInput}
}

const checkBar = (mockCall, desiredData, expectedStackOrder) => {
    const callArg = Bar.mock.calls[mockCall][0] 
    const expectedData = callArg.data.datasets.map((x) => x.data).flat()
    const stackOrder = callArg.data.datasets.map((x) => x.order).flat()
    expect(expectedData).toEqual(desiredData)
    expect(stackOrder).toEqual(expectedStackOrder)  
}

describe("Rebalancing SetUp", () => {
    beforeEach(()=> {jest.clearAllMocks(); render(<RebalancingSetUp data={mockInitial} assetId={assetId} currentValue={currentValue} />) })
    afterEach(()=> jest.clearAllMocks())

    it("renders initial", () => {
       expect(screen.getByText("Current: 36.69% ~ $97,430.30")).toBeInTheDocument()
        expect(screen.getByText("Desired: 63.00% ~ $168,119.71")).toBeInTheDocument()
        expect(screen.getByText("Portfolio Balance: 100% ~ $265,550.00")).toBeInTheDocument()
        const {percentageInput, absoluteInput} = setUp()
        expect(percentageInput.value).toBe("63.00%")
        expect(absoluteInput.value).toBe("$168,119.71")
        expect(Bar).toHaveBeenCalled()
        const callArg = Bar.mock.calls[0][0] 
        const expectedData = callArg.data.datasets.map((x) => x.data).flat()
        const desiredData = [36.69, 63, 100]
        expect(expectedData).toEqual(desiredData)
    })

    it("process input value switch", () => {
        const {percentageInput, absoluteInput} = setUp()
        fireEvent.click(percentageInput)
        expect(percentageInput.value).toBe("63")
        expect(absoluteInput.value).toBe("$168,119.71")
        fireEvent.click(absoluteInput) 
        expect(percentageInput.value).toBe("63.00%")
        expect(absoluteInput.value).toBe("168119.71")
    })
    it("correctly transforms values + passes to bar", () => {
        const {percentageInput, absoluteInput} = setUp()
        fireEvent.click(percentageInput)
        fireEvent.change(percentageInput, {target: {value: '23'}})
        expect(absoluteInput.value).toBe("$61,076.50")
       checkBar(3, [36.69, 23, 100],[2,1,3] )
        fireEvent.click(absoluteInput)
        fireEvent.change(absoluteInput, {target: {value: '200000'}})
        expect(percentageInput.value).toBe("75.32%")
        checkBar(7, [36.69, 75.32, 100], [2,2,3])
    })

  it("correctly handles no input", () => {
    const { percentageInput, absoluteInput } = setUp();

    fireEvent.click(percentageInput);
    fireEvent.change(percentageInput, { target: { value: '' } });
    expect(absoluteInput.value).toBe("$0.00");

    fireEvent.click(absoluteInput);
    fireEvent.change(absoluteInput, { target: { value: '' } });
    expect(percentageInput.value).toBe("0.00%");
  });

  it("shows toast for non-numeric input", () => {
    const { percentageInput, absoluteInput } = setUp();

    fireEvent.click(percentageInput);
    fireEvent.change(percentageInput, { target: { value: 'abc' } });
    expect(screen.getByText("Please type in a number")).toBeInTheDocument();

    fireEvent.click(absoluteInput);
    fireEvent.change(absoluteInput, { target: { value: 'xyz' } });
    expect(screen.getByText("Please type in a number")).toBeInTheDocument();
  });

  it("handles input ending with decimal point", () => {
    const { percentageInput, absoluteInput } = setUp();

    fireEvent.click(percentageInput);
    fireEvent.change(percentageInput, { target: { value: '23.' } });
    expect(absoluteInput.value).toBe("$61,076.50"); // 23% of 265,550

    fireEvent.click(absoluteInput);
    fireEvent.change(absoluteInput, { target: { value: '61076.' } });
    expect(percentageInput.value).toBe("23.00%");  
  });

  it("shows toast when absolute value exceeds portfolio size", () => {
    const { absoluteInput } = setUp();

    fireEvent.click(absoluteInput);
    fireEvent.change(absoluteInput, { target: { value: '300000' } }); // > 265,550
    expect(
      screen.getByText(
        "Your desired balance cannot be larger than the portfolio size."
      )
    ).toBeInTheDocument();
  });

  it("shows toast when percentage exceeds 100%", () => {
    const { percentageInput } = setUp();

    fireEvent.click(percentageInput);
    fireEvent.change(percentageInput, { target: { value: '150' } });
    expect(
      screen.getByText("Your desired balance cannot be larger than 100 percent.")
    ).toBeInTheDocument();
  });

  it("correctly rounds numeric input to two decimal places", () => {
    const { percentageInput, absoluteInput } = setUp();

    fireEvent.click(percentageInput);
    fireEvent.change(percentageInput, { target: { value: '23.456' } });
    expect(absoluteInput.value).toBe("$62,298.03"); // 23.46% of 265,550

    fireEvent.click(absoluteInput);
    fireEvent.change(absoluteInput, { target: { value: '61076.54321' } });
    expect(percentageInput.value).toBe("23.00%"); // 61,076.54 / 265,550 * 100
  });
  it("handles no desired balance", ()=> {
    jest.clearAllMocks()
    render(<RebalancingSetUp data={{...mockInitial, desiredbalance: null}} assetId={assetId} currentValue={currentValue} />)
    expect(screen.getByText("Set desired balancing to see your rebalancing statistics here.")).toBeInTheDocument()
  })
  it("correctly pushes data onBlur", () => {
    const { percentageInput, absoluteInput } = setUp();

    fireEvent.click(percentageInput);
    fireEvent.change(percentageInput, { target: { value: '23.456' } })
    fireEvent.blur(percentageInput)
    const randomScreen = screen.getByText("Portfolio Balance: 100% ~ $265,550.00")
    fireEvent.click(randomScreen) 
    expect(postRebalancing).toHaveBeenCalled()
    const callArgs = postRebalancing.mock.calls
    const expectedOutput = callArgs.flat()
    expect(expectedOutput).toEqual([1, 23.46])
  });
})









