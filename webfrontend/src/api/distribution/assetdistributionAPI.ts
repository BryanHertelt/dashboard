

export const assetDataTableLineChartData = {
labels: [
    "Day 1",
    "Day2",
    "Day 3",
    "Day 4", 
    "Day 5", 
    "Day 6",
    "Day 7" 
], 
datasets: [
    {
        label: "currentValue", 
        data: [890000, 880000, 2000, 850000, 890000, 120000, 400000], 
        borderColor: "#04B900", 
        pointRadius: 0
        
    }
]
}

export const assetLineChartData = {
    labels: [
        "12 PM",
        "1 PM", 
        "2 PM", 
        "3 PM", 
        "4 PM", 
        "5 PM", 
        "6 PM", 
    ], 
    datasets: [
        {
            label: "currentValue", 
            data: [4000, 4200, 4199, 3900, 3750, 4200, 4700, 5000], 
            borderColor: "#005BEA",
            backgroundColor: (context:any) => {
                 const bgColor = [
                 "rgba(0, 91, 234, 0.3)", 
                 "rgba(0, 91, 234, 0.2)",
                 "rgba(0, 91, 234, 0.01)"         
                 ]; 
                 if(!context.chart.chartArea) {
                    return; 
                 } 
            const {ctx, data, chartArea: {top, bottom}} = context.chart; 
            const gradientBg= ctx.createLinearGradient(0, top, 0, bottom)
            const colorTranches = 1 / (bgColor.length -1); 
                 
          for (let i = 0; i < bgColor.length; i++){
            gradientBg.addColorStop(0+ i * colorTranches, bgColor[i])

          } 
           return gradientBg
            },
            pointRadius: 0,
            fill: true, 
        },
    ],
}; 

export const assetPieChartData = {
    labels: [
        "BTC",
        "ETH", 
        "SOL", 
        "USDT"
    ], 
    datasets: [
        {
            label: "Asset",
            data: [300, 100, 207.67, 20],
            backgroundColor: [
                "#0042AB", 
                "#005CD3", 
                "#3686DC", 
                "#1298E6"
            ]
        }
    ]

}