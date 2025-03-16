import { BarChartRebalancing, HoldingBarChart } from "@/utility/lib/design-components/charts/barcharts";
import {render, screen } from "@testing-library/react";
import {formatValue, formatCurrency} from "../../src/utility/lib/helpers/helper-functions"
import '@testing-library/jest-dom'
import { Bar } from "react-chartjs-2";

jest.mock("../../node_modules/react-chartjs-2", () => ({
  Bar: jest.fn().mockImplementation(()=> null)
})) 

jest.mock("../../src/utility/lib/helpers/helper-functions", () => ({
  formatValue: jest.fn((number)=> {
    if(isNaN(Number(number))){
      console.error("Type error in formatValue")
      return("")
    }
    const formattedValue = Number(number).toFixed(2)
  
    return formattedValue
  }), 
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

describe("BarChart Rebalancing", () => {
   describe("BarChart Component for Rebalancing", () => {
    const mockRebalancingData = {
      desiredbalance: 40,
      currentbalance: 30,
      desiredbalancenumber: 16000, 
      currentbalancenumber: 12233 
    }
  
    afterEach(()=> 
    jest.clearAllMocks())
  
    beforeEach(()=> {
      render(<BarChartRebalancing data={mockRebalancingData} theme={"details"}/>)
    })
  
    it("expect labels to be rendered in correct format", () => {
      const label = `Current: ${formatValue(mockRebalancingData.currentbalance)}% ~ ${formatCurrency(
            mockRebalancingData.currentbalancenumber
          )}`
     const labelTwo = `Desired: ${formatValue(mockRebalancingData.desiredbalance)}% ~ ${formatCurrency(
      mockRebalancingData.desiredbalancenumber
    )}`
      expect(screen.getByText(label)).toBeInTheDocument() 
      expect(screen.getByText(labelTwo)).toBeInTheDocument()
    })
    it("called Bar with correct dataset as expected", () => {
      const mockDataSet = {
        labels: [""],
        datasets: [
          {
            label: `Current: 30.00% ~ $12,233.00`,
            data: [30],
            backgroundColor: "rgba(0, 26, 66, 1)",
            borderColor: "rgba(0, 26, 66, 1)",
            borderWidth: 1,
            borderRadius: 7,
          },
          {
            label: `Desired: 40.00% ~ $16,000.00`,
            data: [40],
            backgroundColor: "rgba(122, 122, 122, 1)",
            borderColor: "rgba(122, 122, 122, 1)",
            borderWidth: 1,
            borderRadius: {
              topLeft: 7,
              topRight: 7,
              bottomLeft: 7,
              bottomRight: 7,
            },
          },
        ],
      };
      
      const mockOptions =  {
        responsive: true,
        indexAxis: "y",
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            display: false,
          },
          y: {
            stacked: true,
            display: false,
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 15,
            },
            align: "start",
            display: false,
          },
        },
      };
      expect(Bar).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockDataSet,
          options: mockOptions
        }),
        expect.any(Object) 
      );
    })
    it("calls formatter functions as expected", () => { 
      expect(formatValue).toHaveBeenCalled()
      expect(formatCurrency).toHaveBeenCalled()
    
    })
  });
   describe("Bar Chart Component handling no desired balance", () => {
  it("renders certain message, if desiredbalance is equal to zero", () => {
    const mockRebalancingData = {
      desiredbalance: 40,
      currentbalance: 30,
      desiredbalancenumber: null, 
      currentbalancenumber: 12233 
    }
  
    render(<BarChartRebalancing data={mockRebalancingData} theme={"details"}/>)
    expect(screen.getByText("Set desired balancing to see your rebalancing statistics here.")).toBeInTheDocument()
  })
  })
})

describe("Holding Bar Chart", () => {
  const mockDataSets= {
    datasets: [
          {
              backgroundColor: "rgba(0, 92, 211, 1)", 
              borderColor: "rgba(0, 26, 66, 1)", 
              borderRadius: 7, 
              borderWidth: 0, 
              data: [45], 
              label: "Binance: 45.00% ~ $75,655.23 ",
            }, 
            {
              backgroundColor: "rgba(54, 134, 220, 1)", 
              borderColor: "rgba(0, 26, 66, 1)", 
              borderRadius: 7, 
              borderWidth: 0, 
              data: [5], 
              label: "Polygon: 5.00% ~ $80,443.96 "
            }, 
            {
              backgroundColor: "#7A7A7A",
              borderRadius: 7, 
              borderWidth: 0, 
              data: [7], 
              label: "Other Holdings: 7.00% ~ $20,000.00 "
            }, 
          ], 
    labels: ['']
  }
  const mockOptions={
      responsive: true,
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 2,
      scales: {
        x: { stacked: true, display: false },
        y: { stacked: true, display: false },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 15 },
          align: "start",
          display: false,
        },
        tooltip: {
          enabled: false,
        },
    }
  }
    describe("Holding Bar Chart Component for Holdings for all holdings", () => {
    let holdingMockCrypto = [
      {
        holdingurl: "https://example.com/SYGqO",
        assetvalue: 97814.0,
        currencyvalue: 75655.23,
        holdingdistribution: 45,
        holdingname: "Binance"
      },
      {
        holdingurl: "https://example.com/vHXHK",
        assetvalue: 40428.68,
        currencyvalue: 10000,
        holdingdistribution: 3,
        holdingname: "Huobi"
      },
      {
        holdingurl: "https://example.com/YyoqS",
        assetvalue: 6646.08,
        currencyvalue: 80443.96,
        holdingdistribution: 5,
        holdingname: "Polygon"
      }, 
      {
        holdingurl: "https://example.com/vHXHK",
        assetvalue: 40428.68,
        currencyvalue: 10000,
        holdingdistribution: 4,
        holdingname: "Bybit" 
      }
    ]
  
    afterEach(()=> {
      jest.clearAllMocks()
    })


    beforeEach(()=> {
      render(<HoldingBarChart data={holdingMockCrypto}/>)
    })
  
  
    it("should render all lables and wraps other holdings", () => {
      expect(screen.getByText("Binance: 45.00% ~ $75,655.23")).toBeInTheDocument()
      expect(screen.getByText("Polygon: 5.00% ~ $80,443.96")).toBeInTheDocument()
      expect(screen.getByText("Other Holdings: 7.00% ~ $20,000.00")).toBeInTheDocument()
    })
  
    it("calls formatter functions as expected", () => { 
      expect(formatValue).toHaveBeenCalled()
      expect(formatCurrency).toHaveBeenCalled()
     
    })
  
    it("renders bar with correct datasets", () => {
      expect(Bar).toHaveBeenCalledWith(expect.objectContaining( {
        data: expect.objectContaining(mockDataSets),
        options: mockOptions
      }), 
      expect.any(Object)
    );
    })
  });
    describe("handling missing dataasets", () => {

    afterEach(()=> jest.clearAllMocks())

    it("render just one dataset, if no main holdings", () => {
      const mockData = [
        {
          holdingurl: "https://example.com/vHXHK",
          assetvalue: 40428.68,
          currencyvalue: 10000,
          holdingdistribution: 3,
          holdingname: "Huobi"
        },
        {
          holdingurl: "https://example.com/vHXHK",
          assetvalue: 40428.68,
          currencyvalue: 10000,
          holdingdistribution: 4,
          holdingname: "Bybit" 
        }
      ]
      const mockDataSet= {
        datasets: [
                {
                  backgroundColor: "#7A7A7A",
                  borderRadius: 7, 
                  borderWidth: 0, 
                  data: [7], 
                  label: "Other Holdings: 7.00% ~ $20,000.00 "
                }, 
              ], 
        labels: ['']
      }
      render(<HoldingBarChart data={mockData}/> )
      expect(Bar).toHaveBeenCalledWith(expect.objectContaining( {
        data: expect.objectContaining(mockDataSet),
        options: mockOptions
      }), 
      expect.any(Object)
    );
    })
    it("render no other holdings, if no holdings with less than 5% distribution are available ", () => {
      const mockData = [
        {
          holdingurl: "https://example.com/SYGqO",
          assetvalue: 97814.0,
          currencyvalue: 75655.23,
          holdingdistribution: 45,
          holdingname: "Binance"
        }
      ]
      const mockDataSet= {
        datasets: [mockDataSets.datasets[0]], 
        labels: ['']
      }
      render(<HoldingBarChart data={mockData}/>)

      expect(screen.queryByText("Other Holdings: 7.00% ~ $20,000.00 ")).toBeNull()
      expect(Bar).toHaveBeenCalledWith(expect.objectContaining( {
        data: expect.objectContaining(mockDataSet),
        options: mockOptions
      }), 
      expect.any(Object)
    );
    })
    it("renders error message, when no data is available", () => {
      const mockData = [] 
      render(<HoldingBarChart data={mockData}/> ) 
      expect(screen.getByText("No chart data available right now.")).toBeInTheDocument()
    })
  })
})






