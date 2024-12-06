"use client";
import { Pie } from "react-chartjs-2";
import { doughnutLabel } from "@/api/distribution/chartdataformatter";

const DistributionComponent = (props: any) => {
  return (
    <>
      <header>
        <h1>{props.title}</h1>
        <p className="text-icongray mb-3">{props.text}</p>
      </header>
      <hr />
      <div className=" flex flex-row justify-center align-middle w-full h-full my-11">
        <div className="flex flex-row justify-center w-10/12 h-4/6">
          <Pie
            options={props.pieoptions}
            data={props.piedata}
            plugins={[doughnutLabel]}
          />
        </div>
      </div>
    </>
  );
};

export default DistributionComponent;
