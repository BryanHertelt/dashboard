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


const generateComparator = (cb, btc, eth) => {
    return {
        costbasis: cb, 
        btc: btc,
        eth: eth
    }
}

const mockQuery = [
    {"x": "2025-01-17T10:05:00.000Z", "y": [174, 174]},
    {"x": "2025-01-17T10:10:00.000Z", "y": [520, 520]},
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
    { timeframe: "5 years", timeunit: "year" },
  ];

  const result = {
    labelP: "networth", 
    dataP: [mockQuery[0].y[0], mockQuery[1].y[0]],
    noData: null, 
    labelScndDataP: "invest", 
    labelThdData: "change", 
  }

  const generateTest = (dropDown, mockQueryData, comparator, scope, result) => {
    for(let i = 1; i <= dropDown.length; i++){
        render(<LineChartComponent 
            processedQueryData={mockQueryData} 
            timeframe={{timeframe: dropDown[i-1].timeframe, timeunit: dropDown[i-1].timeunit}} 
            comparators={{ costbasis: comparator[0], btc: comparator[1], eth: comparator[2]}} 
            scope= {scope}
            />)
        expect(Line).toHaveBeenCalledTimes(i)
        expect(Line.mock.calls[i-1][0]).toEqual(expect.objectContaining({
            data: expect.objectContaining({
                datasets: expect.arrayContaining([expect.objectContaining({label: "networth", data: [mockQuery[0].y[0], mockQuery[1].y[0]]}), 
                          expect.objectContaining({label: "invest", data: null}), 
                          expect.objectContaining({label: "change", data: null})])
        })
        }), expect.any(Object))
}

  }

describe("scope == portfoliotimeframes", () => {
    afterEach(()=> {
        jest.clearAllMocks() 
    })

    it("calls with no comparators and right args", () => {
        for(let i = 1; i <= dropDownMenuValues.length; i++){
                render(<LineChartComponent 
                    processedQueryData={mockQuery} 
                    timeframe={{timeframe: dropDownMenuValues[i-1].timeframe, timeunit: dropDownMenuValues[i-1].timeunit}} 
                    comparators={generateComparator(false, false, false)} 
                    scope="portfoliotimeframes" 
                    />)
                expect(Line).toHaveBeenCalledTimes(i)
                expect(Line.mock.calls[i-1][0]).toEqual(expect.objectContaining({
                    data: expect.objectContaining({
                        datasets: expect.arrayContaining([expect.objectContaining({label: "networth", data: [mockQuery[0].y[0], mockQuery[1].y[0]]}), 
                                  expect.objectContaining({label: "invest", data: null}), 
                                  expect.objectContaining({label: "change", data: null})])
                })
                }), expect.any(Object))
        }
    })
    
    it("calls with costbasis", () => {
        for(let i = 1; i <= dropDownMenuValues.length; i++){
            render(<LineChartComponent 
                processedQueryData={mockQuery} 
                timeframe={{timeframe: dropDownMenuValues[i-1].timeframe, timeunit: dropDownMenuValues[i-1].timeunit}} 
                comparators={generateComparator(false, false, false)} 
                scope="portfoliotimeframes" 
                />)
            expect(Line).toHaveBeenCalledTimes(i)
            expect(Line.mock.calls[i-1][0]).toEqual(expect.objectContaining({
                data: expect.objectContaining({
                    datasets: expect.arrayContaining([expect.objectContaining({label: "networth", data: [mockQuery[0].y[0], mockQuery[1].y[0]]}), 
                              expect.objectContaining({label: "invest", data: null}), 
                              expect.objectContaining({label: "change", data: null})])
            })
            }), expect.any(Object))
    }
    })

})
// npm run test line-charts.test.jsx   