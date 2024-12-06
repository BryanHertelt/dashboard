import ParentListComponent from "../_components/listparentcomp";
import DistributionComponent from "../_components/distributioncomp";
import DetailTableComponent from "../_components/tabledetailcomp";

import { assetgroupdistributioncolumns } from "@/utility/lib/distribution/col-ag";
import { assetGroupData } from "@/api/distribution/asset-distributiontabledata";
import { assetgrouplistcolumns } from "@/utility/lib/distribution/col-ag";

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
export default AssetGroupDistributionComponent;
