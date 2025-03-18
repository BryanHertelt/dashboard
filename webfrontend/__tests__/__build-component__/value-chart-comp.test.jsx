
import '@testing-library/jest-dom'
import { BitcoinIcon, EthereumIcon } from "../../public/images/index";
import { LineChartComponent } from "../../src/utility/lib/design-components/charts/line-charts";
import { useValueChart } from "../../src/utility/lib/datafetching/client-refetch/client-hooks";
import { getTimeFrames } from "../../src/utility/lib/datafetching/layer";
import {
  LoadingSkeleton,
  ErrorSkeleton,
} from "../../src/utility/lib/datafetching/loading-skeleton"
import { formatCurrency} from '../../src/utility/lib/helpers/helper-functions'
import { render, screen, fireEvent } from '@testing-library/react'
import AssetValueChartComponent from "../../src/utility/lib/build-components/value-chart-comp"


jest.mock("../../src/utility/lib/helpers/helper-functions", () => ({
  formatCurrency: jest.fn((number)=> {
      if(isNaN(Number(number))){
        console.error("Type error in formatCurrency")
        return("")
      }
    const formattedCurrency = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(number)); 
    return formattedCurrency
    })
})) 

jest.mock("../../src/utility/lib/design-components/charts/line-charts", () => ({
    LineChartComponent: jest.fn().mockImplementation(()=> null)
}))

jest.mock("../../src/utility/lib/datafetching/client-refetch/client-hooks", () => ({
    useValueChart: jest.fn().mockImplementation(()=> hookValue)
    }))

jest.mock("../../public/images/index", () => ({
    BitcoinIcon: jest.fn().mockImplementation(() => <p> BitcoinIcon </p> ), 
    EthereumIcon: jest.fn().mockImplementation(() => <p> EthereumIcon   </p> ), 
}))

jest.mock("../../src/utility/lib/datafetching/loading-skeleton", () => ({
    LoadingSkeleton: jest.fn().mockImplementation(()=> null), 
    ErrorSkeleton: jest.fn().mockImplementation(()=> null)
}))

const mockSevenDays = [
        {"x": "2025-01-16T00:00:00.000Z", "y": [1304, 100]},
        {"x": "2025-01-17T00:00:00.000Z", "y": [1790, 100]}
      ]

const queryMock = [
    {"x": "2025-01-16T00:00:00.000Z", "y": [1304, 100]},
    {"x": "2025-01-17T00:00:00.000Z", "y": [1790, 100]}
  ]


  const importantElements = [
    "BitcoinIcon", 
    "EthereumIcon", 
    "Cost Basis", 
    "Assets", 
    "7d", 
    "My Assets", 
    "$50.00",
  ]
  const dropDownMenuValues = [
    { timeframe: "YTD", timeunit: "month" },
    { timeframe: "all", timeunit: "year" },
    { timeframe: "1 hour", timeunit: "minute" },
    { timeframe: "4 hours", timeunit: "minute" },
    { timeframe: "12 hours", timeunit: "hour" },
    { timeframe: "1 day", timeunit: "hour" },
    { timeframe: "7 days", timeunit: "day" },
    { timeframe: "1 month", timeunit: "day" },
    { timeframe: "3 months", timeunit: "week" },
    { timeframe: "6 months", timeunit: "month" },
    { timeframe: "1 year", timeunit: "month" },
    { timeframe: "3 years", timeunit: "month" },
    { timeframe: "5 years", timeunit: "year" },]


describe("hook resolved", () => {
    const hookValue =  {
        processedQueryData: queryMock, 
        isLoading: false, 
        isError: false
    }

    beforeEach(()=> {
        jest.clearAllMocks()
        useValueChart.mockImplementation(()=> hookValue)
        render(<AssetValueChartComponent initialData={mockSevenDays} currentValue={50} />)
    })

    it("should render all relevant elements", () => {
 
      importantElements.map((element) => {
        expect(screen.getByText(element)).toBeInTheDocument()
      })
    })

    it("should call line chart component with the right args", () => {
      expect(LineChartComponent).toHaveBeenCalledTimes(1)
      expect(LineChartComponent).toHaveBeenCalledWith(expect.objectContaining({
        timeframe: expect.objectContaining({timeframe: "7 days", timeunit:"day"}),
        comparators: expect.objectContaining({costbasis: false, btc: false, eth: false}), 
        processedQueryData: expect.arrayContaining(queryMock),
        scope: "portfoliotimeframes"
      }), expect.any(Object))
    })
})


describe("on Cost Basis Click", ()=> {
  const hookValue =  {
    processedQueryData: queryMock, 
    isLoading: false, 
    isError: false
}
  beforeEach(()=> {
    jest.clearAllMocks()
    useValueChart.mockImplementation(()=> hookValue)
    render(<AssetValueChartComponent initialData={mockSevenDays} currentValue={50} />)
    const costBasisButton = screen.getByRole("button", {name: /Cost Basis/i})
    fireEvent.click(costBasisButton)
})

afterEach(()=> jest.clearAllMocks())

it("should call LineChart Components with other arguments", () => {
  expect(LineChartComponent).toHaveBeenCalledTimes(2)
  expect(LineChartComponent.mock.calls[1][0].comparators).toEqual({costbasis: true, btc: false, eth: false})
  expect(LineChartComponent.mock.calls[1][0].processedQueryData).toEqual(queryMock)
  expect(LineChartComponent.mock.calls[1][0].scope).toEqual("portfoliotimeframes")
})

it("should render two elements cost basis", () => {

const elements = screen.getAllByText("Cost Basis");
 expect(elements.length).toBe(2)
})


it("should render all relevant elements", () => {
 
  importantElements.map((element) => {
    if(element != "Cost Basis"){
      expect(screen.getByText(element)).toBeInTheDocument()
    }
  })
})
})



describe("on Asset Clicks", () => {
  const devMock = [
    { "x": "2025-01-16T23:00:00.000Z", "y": [12, 14, 7] },
    { "x": "2025-01-16T23:10:00.000Z", "y": [18, 19, 5] }
  ];

  const hookValue = {
    processedQueryData: devMock,
    isLoading: false,
    isError: false
  };

  const testData = [
    {
      name: "BitcoinIcon",
      comparators: { costbasis: false, btc: true, eth: false },
      text: "Bitcoin ≈",
      percentage: "19 %", 
    },
    {
      name: "EthereumIcon",
      comparators: { costbasis: false, btc: false, eth: true },
      text: "Ethereum ≈",
      percentage: "5 %", 
    }, 
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useValueChart.mockImplementation(() => hookValue);
    render(<AssetValueChartComponent initialData={mockSevenDays} currentValue={50} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  testData.forEach(({ name, comparators, text, percentage }) => {
    describe(`on ${name} Clicks`, () => {
      beforeEach(() => {
        const button = screen.getByRole("button", { name: new RegExp(name, 'i') });
        fireEvent.click(button);
      });

      it("should call LineChart Components with correct arguments", () => {
        expect(LineChartComponent).toHaveBeenCalledTimes(2);
        expect(LineChartComponent.mock.calls[1][0].comparators).toEqual(comparators);
        expect(LineChartComponent.mock.calls[1][0].processedQueryData).toEqual(devMock);
        expect(LineChartComponent.mock.calls[1][0].scope).toEqual("development");
      });

      it(`should render ${name} comparison`, () => {
        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.getByText(percentage)).toBeInTheDocument();
        expect(screen.getByText("My Assets")).toBeInTheDocument(); 
        expect(screen.getByText("≈")).toBeInTheDocument();
        expect(screen.getByText("18 %")).toBeInTheDocument();
      });

      it("should render all relevant elements", () => {
        importantElements.forEach((element) => {
          expect(screen.getByText(element)).toBeInTheDocument();
        });
      });
    });
  });
});

describe("both Assets Clicks", () => {
  const devMock = [
    { "x": "2025-01-16T23:00:00.000Z", "y": [12, 14, 7] },
    { "x": "2025-01-16T23:10:00.000Z", "y": [18, 19, 5] }
  ];

  const hookValue = {
    processedQueryData: devMock,
    isLoading: false,
    isError: false
  };
  beforeEach(() => {
    jest.clearAllMocks();
    useValueChart.mockImplementation(() => hookValue);
    render(<AssetValueChartComponent initialData={mockSevenDays} currentValue={50} />);
    const btcButton = screen.getByRole("button", {name: /BitcoinIcon/i});
    const ethButton = screen.getByRole("button", {name: /EthereumIcon/i});
    fireEvent.click(btcButton);
    fireEvent.click(ethButton)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders both Buttons", () => {
    expect(screen.getByText("Bitcoin ≈")).toBeInTheDocument();
    expect(screen.getByText("Ethereum ≈")).toBeInTheDocument();
    expect(screen.getByText("19 %")).toBeInTheDocument();
    expect(screen.getByText("5 %")).toBeInTheDocument();
    expect(screen.getByText("My Assets")).toBeInTheDocument(); 
    expect(screen.getByText("≈")).toBeInTheDocument();
    expect(screen.getByText("18 %")).toBeInTheDocument();
  })

  it("calls LineChartComponent three times", () => {
    expect(LineChartComponent).toHaveBeenCalledTimes(3)
  })
})

describe("makes the right calls for each timeframe", () => {

})



describe("useValueChart behavior on different states", () => {
  const testCases = [
    {
      description: "when the hook is loading",
      hookValue: { processedQueryData: undefined, isLoading: true, isError: false },
      expectedCalls: { LineChart: 0, LoadingSkeleton: 1, ErrorSkeleton: 0 }
    },
    {
      description: "when the hook returns an error",
      hookValue: { processedQueryData: [], isLoading: false, isError: true },
      expectedCalls: { LineChart: 0, LoadingSkeleton: 0, ErrorSkeleton: 1 }
    }
  ];

  testCases.forEach(({ description, hookValue, expectedCalls }) => {
    describe(description, () => {
      beforeEach(() => {
        jest.clearAllMocks();
        useValueChart.mockImplementation(() => hookValue);
        render(<AssetValueChartComponent initialData={mockSevenDays} currentValue={50} />);
      });

      it("should render all relevant elements", () => {
        importantElements.forEach((element) => {
          expect(screen.getByText(element)).toBeInTheDocument();
        });
      });

      it("should handle component calls correctly", () => {
        expect(LineChartComponent).toHaveBeenCalledTimes(expectedCalls.LineChart);
        expect(LoadingSkeleton).toHaveBeenCalledTimes(expectedCalls.LoadingSkeleton);
        expect(ErrorSkeleton).toHaveBeenCalledTimes(expectedCalls.ErrorSkeleton);
      });
    });
  });
});

describe("select timeframe works properly", () => {
  const hookValue = {
    processedQueryData: queryMock,
    isLoading: false,
    isError: false
  };
  beforeEach(()=> {
    jest.clearAllMocks(); 
    useValueChart.mockImplementation(()=> hookValue); 
    render(<AssetValueChartComponent initialData={mockSevenDays} currentValue={50} />);
  })
  it("should call Line Chart with the right props", () => {
   dropDownMenuValues.map((timeframeObject)=> {
    jest.clearAllMocks()
    const tfButton = screen.getByRole("button", {name: new RegExp(timeframeObject.timeframe, 'i') })
    fireEvent.click(tfButton)
    expect(LineChartComponent).toHaveBeenCalledTimes(1); 
    expect(LineChartComponent.mock.calls[0][0].timeframe).toEqual({timeframe: timeframeObject.timeframe, timeunit: timeframeObject.timeunit});
   })
  })
})