import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ArcElement,
    Filler,
  } from "chart.js";
import { assetGroupData, holdingsData } from "./asset-distributiontabledata";

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
import { StructureLayer, PortfolioDataInterface } from "../layer";

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

export const getAssetLineChartData = async () => {
  const portfoliodata: PortfolioDataInterface[] | null = await StructureLayer.fetchDistributionUnits("portfolios", "?portfolioid=2");

  if (portfoliodata && Array.isArray(portfoliodata) && portfoliodata.length > 0) {
    const portfoliochange7d = portfoliodata.map((portfolio) => portfolio.change7d);

    return {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "currentValue",
          data: portfoliochange7d,
          borderColor: "#005BEA",
          backgroundColor: (context: any) => {
            const bgColor = [
              "rgba(0, 91, 234, 0.3)",
              "rgba(0, 91, 234, 0.2)",
              "rgba(0, 91, 234, 0.01)",
            ];
            if (!context.chart.chartArea) {
              return "rgba(0, 91, 234, 0.1)"; 
            }
            const { ctx, chartArea: { top, bottom } } = context.chart;
            const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
            const colorTranches = 1 / (bgColor.length - 1);

            for (let i = 0; i < bgColor.length; i++) {
              gradientBg.addColorStop(i * colorTranches, bgColor[i]);
            }
            return gradientBg;
          },
          pointRadius: 0,
          fill: true,
        },
      ],
    };
  } else {
    console.warn("No portfolio data or invalid data structure.");
    return null;
  }
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


export const assetGroupPieChartData = {
labels: assetGroupData.map((agobject)=> agobject.groupname),
datasets: [
    {
        label: "Share",
        data: assetGroupData.map(((agobject)=> agobject.grouppercentage)),
        backgroundColor: [
            "#0042AB", 
            "#005CD3", 
            "#3686DC", 
            "#1298E6"
        ]
    }
]
}

export const holdingsPieChartData = {
  labels: holdingsData.map((holdingobject)=> holdingobject.holdingname ),
  datasets: [
    {
    label: "Share",
    data: holdingsData.map((holdingsobject)=>holdingsobject.holdingpercentage ),
    backgroundColor: [
      "#0042AB", 
      "#005CD3", 
      "#3686DC", 
      "#1298E6"
  ]
    }
  ]
}
  
  export const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        position: "right",
      },
    },
    layout: {
      padding: 0,
    },
    animation: {
      duration: 0,
    },
  };
  
  export const assetDataTableLineChartDataOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    layout: {
      padding: 0,
    },
    animation: {
      duration: 0,
    },
  };
  
  export const doughnutLabel = 
  {
    id: "doughnutLabel",
    afterDatasetsDraw(chart: any, args: any, plugins: any) {
      const { ctx, data } = chart;
  
      const centerX = chart.getDatasetMeta(0).data[0].x;
      const centerY = chart.getDatasetMeta(0).data[0].y;
  
      ctx.save();
      ctx.font = "bold 1.25rem sans-serif";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$123,000.22", centerX, centerY - 11);
  
      ctx.font = "1rem sans-serif";
      ctx.fillText("100%", centerX, centerY + 11);
  }
} 
  
 export const pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };
