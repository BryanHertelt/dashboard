"use client";
import { Pie } from "react-chartjs-2";
import { doughnutLabel } from "@/api/distribution/chartdataformatter";
import { formatPieData } from "@/utility/lib/dataformatters/formatchartdata";

const DistributionComponent = (props: any) => {
  const piedata = formatPieData(props.piedata);
  return (
    <>
      <header>
        <h1 className="font-semibold text-xl">{props.title}</h1>
        <p className="text-icongray mb-3">{props.text}</p>
      </header>
      <hr />
      <div className=" flex flex-row justify-center align-middle w-full h-full my-11">
        <div className="flex flex-row justify-center w-10/12 h-4/6">
          <Pie
            options={props.pieoptions}
            data={piedata}
            plugins={[doughnutLabel]}
          />
        </div>
      </div>
    </>
  );
};

export default DistributionComponent;
