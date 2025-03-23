import '@testing-library/jest-dom'
import {LineChartComponent} from "../../src/utility/lib/design-components/charts/line-charts"
import { formatCurrency, formatValue} from '../../src/utility/lib/helpers/helper-functions'
import { Line } from 'react-chartjs-2'
import { Chart } from 'chart.js'
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { act } from "react";


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


const portfolioQuery = [
    {"x": "2025-01-17T10:05:00.000Z", "y": [174, 174]},
    {"x": "2025-01-17T10:10:00.000Z", "y": [520, 520]},
]

const devQuery = [
    {"x": "2025-01-16T23:00:00.000Z", "y": [12, 14, 7]},
    {"x": "2025-01-16T23:10:00.000Z", "y": [18, 19, 5]},
]

jest.mock("../../node_modules/react-chartjs-2", () => ({
    Line: jest.fn().mockImplementation(()=> null)
  })) 

let result = {
    dataP: [portfolioQuery[0].y[0], portfolioQuery[1].y[0]],
    dataScnd: null, 
    dataThd: null, 
    labelFirst: "networth",
    labelScnd: "invest", 
    labelThd: "change", 
  }


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
    { timeframe: "5 years", timeunit: "year" },
  ];

  const generateTest = (result, i) => {
        expect(Line).toHaveBeenCalledTimes(i)
        expect(Line.mock.calls[i-1][0]).toMatchObject(expect.objectContaining({
            data: expect.objectContaining({
                datasets: expect.arrayContaining([
                          expect.objectContaining({label: result.labelFirst, data: result.dataP}), 
                          expect.objectContaining({label: result.labelScnd, data: result.dataScnd}), 
                          expect.objectContaining({label: result.labelThd, data: result.dataThd}),
                        ]),
                        
        })
        }), expect.any(Object))}

describe("scope == portfoliotimeframes", () => {
    afterEach(()=> {
        jest.clearAllMocks() 
    })

    it("no comparator", () => {
        for(let i = 1; i <= dropDownMenuValues.length; i++){
            render(<LineChartComponent 
                processedQueryData={portfolioQuery} 
                timeframe={{timeframe: dropDownMenuValues[i-1].timeframe, timeunit: dropDownMenuValues[i-1].timeunit}} 
                comparators={{ costbasis: false, btc:false, eth: false}} 
                scope= "portfoliotimeframes"
                />)
            generateTest(result, i)
            }
    })
    it("costbasis enabled ", () => {
        const updatedResult = {
            ...result, 
             dataP:[portfolioQuery[0].y[0], portfolioQuery[1].y[0]],
             dataScnd:[portfolioQuery[0].y[1], portfolioQuery[1].y[1]]
        }
        for(let i = 1; i <= dropDownMenuValues.length; i++){
            render(<LineChartComponent 
                processedQueryData={portfolioQuery} 
                timeframe={{timeframe: dropDownMenuValues[i-1].timeframe, timeunit: dropDownMenuValues[i-1].timeunit}} 
                comparators={{ costbasis: true, btc:false, eth: false}} 
                scope= "portfoliotimeframes"
                />)
            generateTest(updatedResult, i)
            }

    })
}) 

describe("scope == development", () => {
    afterEach(()=> {
        jest.clearAllMocks()
    })

    it("btc enabled", () => {
        const updatedResult = {
            ...result, 
             labelFirst: "change",
             labelScnd: "change", 
             dataP:    [devQuery[0].y[0], devQuery[1].y[0]],
             dataScnd:[devQuery[0].y[1], devQuery[1].y[1]], 
             dataThd: null, 
        }
        for(let i = 1; i <= dropDownMenuValues.length; i++){
            render(<LineChartComponent 
                processedQueryData={devQuery} 
                timeframe={{timeframe: dropDownMenuValues[i-1].timeframe, timeunit: dropDownMenuValues[i-1].timeunit}} 
                comparators={{ costbasis: false, btc:true, eth: false}} 
                scope= "development"
                />)
            generateTest(updatedResult, i)
            }
    })

    it("eth enabled", () => {
        const updatedResult = {
            ...result, 
             labelFirst: "change",
             labelScnd: "change", 
             dataP:    [devQuery[0].y[0], devQuery[1].y[0]],
             dataScnd: null, 
             dataThd: [devQuery[0].y[2], devQuery[1].y[2]], 
        }
        for(let i = 1; i <= dropDownMenuValues.length; i++){
            render(<LineChartComponent 
                processedQueryData={devQuery} 
                timeframe={{timeframe: dropDownMenuValues[i-1].timeframe, timeunit: dropDownMenuValues[i-1].timeunit}} 
                comparators={{ costbasis: false, btc:false, eth: true}} 
                scope= "development"
                />)
            generateTest(updatedResult, i)
            }
    })

    it("btc and eth enabled", () => {
        const updatedResult = {
            ...result, 
             labelFirst: "change",
             labelScnd: "change", 
             dataP:    [devQuery[0].y[0], devQuery[1].y[0]],
             dataScnd:[devQuery[0].y[1], devQuery[1].y[1]],  
             dataThd: [devQuery[0].y[2], devQuery[1].y[2]], 
        }
        for(let i = 1; i <= dropDownMenuValues.length; i++){
            render(<LineChartComponent 
                processedQueryData={devQuery} 
                timeframe={{timeframe: dropDownMenuValues[i-1].timeframe, timeunit: dropDownMenuValues[i-1].timeunit}} 
                comparators={{ costbasis: false, btc:true, eth: true}} 
                scope= "development"
                />)
            generateTest(updatedResult, i)
            }
    })
    it("does not render cost basis when screening development", () => {
        const updatedResult = {
            ...result, 
             labelFirst: "change",
             labelScnd: "change", 
             dataP:    [devQuery[0].y[0], devQuery[1].y[0]],
             dataScnd:[devQuery[0].y[1], devQuery[1].y[1]],  
             dataThd: [devQuery[0].y[2], devQuery[1].y[2]], 
        }
        for(let i = 1; i <= dropDownMenuValues.length; i++){
            render(<LineChartComponent 
                processedQueryData={devQuery} 
                timeframe={{timeframe: dropDownMenuValues[i-1].timeframe, timeunit: dropDownMenuValues[i-1].timeunit}} 
                comparators={{ costbasis: true, btc:true, eth: true}} 
                scope= "development"
                />)
            generateTest(updatedResult, i)
            }
    })
})

describe("edge cases", () => {
    afterEach(()=> {
        jest.clearAllMocks()
    })

    it("does not receive props", () => {
        const updatedResult = {
            ...result, 
             labelFirst: "networth",
             labelScnd: "invest", 
             dataP:    [portfolioQuery[0].y[0], portfolioQuery[1].y[0]],
             dataScnd:null,  
             dataThd: null, 
        }
        for(let i = 1; i <= dropDownMenuValues.length; i++){
            render(<LineChartComponent 
                processedQueryData={portfolioQuery} 
                timeframe={undefined} 
                comparators={undefined} 
                scope= {undefined}
                />)
            generateTest(updatedResult, i)
            }
    })
})


describe("renders tooltip", () => {
    test("renders tooltip when hovering over a data point", async () => {
        render(<LineChartComponent 
            processedQueryData={portfolioQuery} 
            timeframe={{timeframe: "7 days", timeunit:"day"}} 
            comparators={{ costbasis: false, btc:false, eth: false}} 
            scope= "portfoliotimeframes"
            />);
      
            const canvas = document.querySelector("canvas"); // Assuming canvas gets an img role
        const chartInstance = Chart.getChart(canvas);
      
        expect(chartInstance).toBeDefined();
      
        // Spy on the Chart.js method
        const spy = jest.spyOn(chartInstance, "setActiveElements");
      
        // Simulate a hover over a data point
        chartInstance.setActiveElements([{ datasetIndex: 0, index: 2 }]);
        chartInstance.update();
      
        // Verify that `setActiveElements` was called
        expect(spy).toHaveBeenCalledWith([{ datasetIndex: 0, index: 2 }]);
      
        // Optional: Check if tooltip content appears
        const tooltip = await screen.findByText(/expected tooltip content/i);
        expect(tooltip).toBeInTheDocument();
      });
})