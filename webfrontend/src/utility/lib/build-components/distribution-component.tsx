"use client";
import { Pie } from "react-chartjs-2";
import { doughnutLabel } from "@/api/distribution/chartdataformatter";
import { formatPieData } from "../design-components/charts/pie-chart-formatter";
import { DistributionChart } from "../design-components/charts/doughnut-charts";

interface pieDataInterface {
  symbol: string;
  assetname: string;
  assetvalue: number | undefined;
  distribution: number;
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
  console.log("pie Data in distirbution ", piedata);
  return (
    <>
      <header>
        <h1 className="font-semibold text-xl">{title}</h1>
        <p className="text-icongray mb-3">{text}</p>
      </header>
      <hr />
      <div className=" flex flex-row justify-center align-middle w-full h-full my-11">
        <div className="flex flex-row justify-center w-10/12 h-4/6">
          <DistributionChart pieData={piedata} />
        </div>
      </div>
    </>
  );
};

export default DistributionComponent;
