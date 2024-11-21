import {
  DistributionComponent,
  DetailTableComponent,
  ParentListComponent,
} from "@/lib/distribution/asset-distributionpagecomponents";

import { holdingsdistributioncolumns } from "@/lib/distribution/col-holding";
import { holdingslistcolumns } from "@/lib/distribution/col-holding";
import { holdingsData } from "@/api/distribution/asset-distributiontabledata";

import {
  holdingsPieChartData,
  pieChartOptions,
} from "@/api/distribution/assetdistributionAPI";

const HoldingsDistribution = () => {
  return (
    <>
      <div className=" bg-white p-7 h-4/6  w-3/12 rounded-md shadow-even">
        <DistributionComponent
          text={"You can see your Holding Distribution here."}
          title={"Holding Distribution"}
          piedata={holdingsPieChartData}
          pieoptions={pieChartOptions}
        />
      </div>
      <div className="h-4/6 bg-white rounded-md shadow-even w-8/12 flex-grow pl-7 py-7 pr-8 ml-7">
        {" "}
        <ParentListComponent
          listcolumns={holdingslistcolumns}
          listdata={holdingsData}
        />{" "}
      </div>
      <div className="bg-white shadow-even mt-9 p-7 w-full">
        <DetailTableComponent
          text={"You can see all your cryptocurrencies here."}
          title={"Assets"}
          columns={holdingsdistributioncolumns}
          data={holdingsData}
        />
      </div>
    </>
  );
};
export default HoldingsDistribution;
