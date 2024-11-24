import {
  DistributionComponent,
  DetailTableComponent,
  ParentListComponent,
} from "@/lib/distribution/asset-distributionpagecomponents";

import { assetgroupdistributioncolumns } from "@/lib/distribution/col-ag";
import { assetGroupData } from "@/api/distribution/asset-distributiontabledata";
import { assetgrouplistcolumns } from "@/lib/distribution/col-ag";

import {
  assetGroupPieChartData,
  pieChartOptions,
} from "@/api/distribution/assetdistributionAPI";

const AssetGroupDistribution = () => {
  return (
    <>
      <div className=" card p-7 h-4/6  w-3/12">
        <DistributionComponent
          text={"You can see your Asset-Group Distribution here"}
          title={"Asset Group Distribution"}
          piedata={assetGroupPieChartData}
          pieoptions={pieChartOptions}
        />
      </div>
      <div className="card h-4/6 w-8/12 flex-grow pl-7 py-7 pr-8 ml-7">
        {" "}
        <ParentListComponent
          listcolumns={assetgrouplistcolumns}
          listdata={assetGroupData}
        />{" "}
      </div>
      <div className="card mt-9 p-7 w-full">
        <DetailTableComponent
          text={"You can see all your cryptocurrencies here."}
          title={"Assets"}
          columns={assetgroupdistributioncolumns}
          data={assetGroupData}
        />
      </div>
    </>
  );
};
export default AssetGroupDistribution;
