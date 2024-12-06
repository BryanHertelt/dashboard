import DistributionComponent from "../_components/distributioncomp";
import DetailTableComponent from "../_components/tabledetailcomp";
import ParentListComponent from "../_components/listparentcomp";

import { holdingsdistributioncolumns } from "@/utility/lib/distribution/col-holding";
import { holdingslistcolumns } from "@/utility/lib/distribution/col-holding";
import { holdingsData } from "@/api/distribution/asset-distributiontabledata";

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
          pieoptions={pieChartOptions}
        />
      </div>
      <div className="card h-4/6 w-8/12 flex-grow pl-7 py-7 pr-8 ml-7">
        {" "}
        <ParentListComponent
          listcolumns={holdingslistcolumns}
          listdata={holdingsData}
        />{" "}
      </div>
      <div className="card mt-9 p-7 w-full">
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
export default HoldingsDistributionComponent;
