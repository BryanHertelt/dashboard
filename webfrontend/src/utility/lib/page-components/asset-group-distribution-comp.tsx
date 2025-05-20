import { DistributionComponent } from "../charts";

import { assetGroupData } from "@/api/distribution/asset-distributiontabledata";

import {
  assetGroupPieChartData,
  pieChartOptions,
} from "@/api/distribution/chartdataformatter";

const AssetGroupDistributionComponent = () => {
  return (
    <>
      <div className=" card p-7 h-4/6  w-3/12">
        <DistributionComponent
          text={"You can see your Asset-Group Distribution here"}
          title={"Asset Group Distribution"}
          piedata={assetGroupPieChartData}
        />
      </div>
      {/** 
      <div className="card mt-9 p-7 w-full">
        <DetailTableComponent
          text={"You can see all your cryptocurrencies here."}
          title={"Assets"}
          columns={assetgroupdistributioncolumns}
          data={assetGroupData}
        />
      </div>
      */}
    </>
  );
};
export default AssetGroupDistributionComponent;
