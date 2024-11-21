"use client";

import { Line, Pie } from "react-chartjs-2";
import {
  assetDataTableLineChartData,
  lineChartOptions,
  assetDataTableLineChartDataOptions,
  doughnutLabel,
} from "@/api/distribution/assetdistributionAPI";

export const AssetLineChart = (props: any) => {
  return <Line options={lineChartOptions} data={props.data} />;
};

export const PieChart = (props: any) => {
  return (
    <Pie
      options={props.pieoptions}
      data={props.piedata}
      plugins={[doughnutLabel]}
    />
  );
};

export const AssetDataTableLineChart = () => {
  return (
    <Line
      options={assetDataTableLineChartDataOptions}
      data={assetDataTableLineChartData}
    />
  );
};
