"use client";
import { Pie } from "react-chartjs-2";
import { doughnutLabel } from "@/api/distribution/chartdataformatter";
import { formatPieData } from "../charts/pie-chart-formatter";
import { DoughnutChart } from "../charts/doughnut-charts";

interface pieDataInterface {
  symbol: string;
  assetname: string;
  assetvalue: number | undefined;
}
const DistributionComponent = ({
  title,
  text,
  piedata,
}: {
  title: string;
  text: string;
  piedata: any;
}) => {
  return (
    <>
      <header>
        <h1 className="font-semibold text-xl">{title}</h1>
        <p className="text-icongray mb-3">{text}</p>
      </header>
      <hr />
      <div className=" flex flex-row justify-center align-middle w-full border border-black h-full my-5 ">
        <div className="flex flex-row justify-center w-full h-5/6">
          <DoughnutChart pieData={piedata} />
        </div>
      </div>
    </>
  );
};

export default DistributionComponent;
