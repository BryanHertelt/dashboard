"use client";
import { DataTable } from "@/utility/extlib/datatable/data-table";

const DetailTableComponent = (props: any) => {
  return (
    <>
      <div className="flex flex-row justify-between mb-7">
        <header>
          <h1 className="font-semibold text-xl"> {props.title} </h1>
          <p className="text-icongray">{props.text}</p>
        </header>
        <nav className="flex flex-row justify-around">
          <button className="mr-5 px-2 text-base h-5/6 active:bg-blue active:text-white focus:bg-blue focus:text-white rounded-md">
            {" "}
            Cryptocurrencies{" "}
          </button>
          <button className="mr-5 px-2 text-base h-5/6 active:bg-blue active:text-white focus:bg-blue focus:text-white rounded-md">
            {" "}
            NFTs{" "}
          </button>
          <button className="mr-5 px-2 text-base h-5/6 active:bg-blue active:text-white focus:bg-blue focus:text-white rounded-md">
            {" "}
            Derivatives{" "}
          </button>
        </nav>
      </div>
      <div>
        <DataTable columns={props.columns} data={props.data} />
      </div>
    </>
  );
};

export default DetailTableComponent;
