import { assetGroupData } from "@/api/distribution/asset-distributiontabledata";

import {
  assetGroupPieChartData,
  pieChartOptions,
} from "@/api/distribution/chartdataformatter";

const AssetGroupDistributionComponent = () => {
  return (
    <>
      <div>Asset Group Distribution</div>
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
