

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
            borderColor: "#005BEA"
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