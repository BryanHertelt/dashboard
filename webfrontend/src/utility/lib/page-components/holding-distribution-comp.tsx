import { DistributionComponent } from "../charts";

import {
  holdingsPieChartData,
  pieChartOptions,
} from "@/api/distribution/chartdataformatter";

const HoldingsDistributionComponent = () => {
  return (
    <>
      <div className="card p-7 h-4/6  w-3/12">
        <DistributionComponent
          text={"You can see your Holding Distribution here."}
          title={"Holding Distribution"}
          piedata={holdingsPieChartData}
        />
      </div>
      {/* 
      <div className="card mt-9 p-7 w-full">
        <DetailTableComponent
          text={"You can see all your cryptocurrencies here."}
          title={"Assets"}
          columns={holdingsdistributioncolumns}
          data={holdingsData}
        />
      </div>
      */}
    </>
  );
};
export default HoldingsDistributionComponent;
