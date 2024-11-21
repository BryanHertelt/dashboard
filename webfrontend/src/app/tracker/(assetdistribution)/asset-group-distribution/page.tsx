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
      <div className=" bg-white p-7 h-4/6  w-3/12 rounded-md shadow-even">
        <DistributionComponent
          text={"You can see your Asset-Group Distribution here"}
          title={"Asset Group Distribution"}
          piedata={assetGroupPieChartData}
          pieoptions={pieChartOptions}
        />
      </div>
      <div className="h-4/6 bg-white rounded-md shadow-even w-8/12 flex-grow pl-7 py-7 pr-8 ml-7">
        {" "}
        <ParentListComponent
          listcolumns={assetgrouplistcolumns}
          listdata={assetGroupData}
        />{" "}
      </div>
      <div className="bg-white shadow-even mt-9 p-7 w-full">
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
