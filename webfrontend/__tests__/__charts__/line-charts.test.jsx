import {LineChartComponent} from "../../src/utility/lib/design-components/charts/line-charts"
import { formatCurrency, formatValue} from '../../src/utility/lib/helpers/helper-functions'
import { Line } from 'react-chartjs-2'
import { render, screen } from '@testing-library/react'
import { mock } from "node:test"


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


jest.mock("../../node_modules/react-chartjs-2", () => ({
    Line: jest.fn().mockImplementation(()=> null)
  })) 


const portfolioQuery = [
    {"x": "2025-01-17T10:05:00.000Z", "y": [174, 174]},
    {"x": "2025-01-17T10:10:00.000Z", "y": [520, 520]},
]

const devQuery = [
    {"x": "2025-01-16T23:00:00.000Z", "y": [12, 14, 7]},
    {"x": "2025-01-16T23:10:00.000Z", "y": [18, 19, 5]},
]

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

  const generateTest = (dropDown, mockQueryData, comparator, scope, result) => {
    for(let i = 1; i <= dropDown.length; i++){
        render(<LineChartComponent 
            processedQueryData={mockQueryData} 
            timeframe={{timeframe: dropDown[i-1].timeframe, timeunit: dropDown[i-1].timeunit}} 
            comparators={{ costbasis: comparator[0], btc: comparator[1], eth: comparator[2]}} 
            scope= {scope}
            />)
        expect(Line).toHaveBeenCalledTimes(i)
        expect(Line.mock.calls[i-1][0]).toMatchObject(expect.objectContaining({
            data: expect.objectContaining({
                datasets: expect.arrayContaining([
                          expect.objectContaining({label: result.labelFirst, data: result.dataP}), 
                          expect.objectContaining({label: result.labelScnd, data: result.dataScnd}), 
                          expect.objectContaining({label: result.labelThd, data: result.dataThd})
                        ])
        })
        }), expect.any(Object))}
  }

describe("scope == portfoliotimeframes", () => {
    afterEach(()=> {
        jest.clearAllMocks() 
    })

    it("no comparator", () => {
     generateTest(dropDownMenuValues, portfolioQuery, [false, false, false], "portfoliotimeframes", result)
    })

    it("costbasis enabled ", () => {
        const updatedResult = {
            ...result, 
             dataP:[portfolioQuery[0].y[0], portfolioQuery[1].y[0]],
             dataScnd:[portfolioQuery[0].y[1], portfolioQuery[1].y[1]]
        }

        generateTest(dropDownMenuValues, portfolioQuery, [true, false, false], "portfoliotimeframes", updatedResult)

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
        generateTest(dropDownMenuValues, devQuery, [false, true, false], "development", updatedResult )
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
        generateTest(dropDownMenuValues, devQuery, [false, false, true], "development", updatedResult )
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
        generateTest(dropDownMenuValues, devQuery, [false, true, true], "development", updatedResult )
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
        generateTest(dropDownMenuValues, devQuery, [true, true, true], "development", updatedResult )
    })
})
// npm run test line-charts.test.jsx   