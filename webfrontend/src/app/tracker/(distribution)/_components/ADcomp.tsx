"use client";
import AssetValueChartComponent from "../_components/assetvaluechartcomponent";
import DistributionComponent from "../_components/distributioncomp";
import DetailTableComponent from "../_components/tabledetailcomp";

import { assetdistributioncolumns } from "@/utility/lib/distribution/col-ad";
import { cryptocurrencyMockData } from "@/api/distribution/asset-distributiontabledata";

import {
  assetLineChartData,
  assetPieChartData,
  pieChartOptions,
} from "@/api/distribution/chartdataformatter";

const AssetDistributionComponent = (props: any) => {
  let portfolioResponse = props.portfolioResponse[0].currentvalue;
  return (
    <>
      <div className="card h-4/6 w-8/12 flex-grow pl-7 py-7 pr-8">
        <AssetValueChartComponent
          data={assetLineChartData}
          portfolioResponse={portfolioResponse}
        />
      </div>
      <div className="card p-7 h-4/6 ml-7 w-3/12">
        <DistributionComponent
          text={"You can see your Asset Distribution here."}
          title={"Asset Distribution"}
          piedata={assetPieChartData}
          pieoptions={pieChartOptions}
        />
      </div>
      <div className="card mt-9 p-7 w-full">
        <DetailTableComponent
          text={"You can see all your cryptocurrencies here."}
          title={"Assets"}
          columns={assetdistributioncolumns}
          data={cryptocurrencyMockData}
        />
      </div>
    </>
  );
};

export default AssetDistributionComponent;
