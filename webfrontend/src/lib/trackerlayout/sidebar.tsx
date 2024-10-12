import { sidebarnavResponse } from "@/api/sidebarnavAPI";
import Link from "next/link";
import { LogoIcon, FoldSideBarIcon } from "../../../public/images";
import React from "react";

export default function SidebarContainer() {
  return (
    <nav className="flex flex-col h-full border border-red-300 w-full ">
      <header className="flex flex-row justify-start m-2.5 my-3.5 align-baseline">
        <LogoIcon className="text-4xl" />
        <h1 className="text-3xl font-semibold"> Flyzer </h1>
        <div className=" flex flex-row w-1/2 justify-end ">
          <FoldSideBarIcon className="text-4xl" />
        </div>
      </header>
      <hr />
      <ul className="mt-5">
        <li className="text-sm font-light text-gray-400 pl-5"> General </li>
        {sidebarnavResponse.map((sidebarElementContainer) => {
          if (sidebarnavResponse.indexOf(sidebarElementContainer) < 9)
            return (
              <li key={sidebarElementContainer.id}>
                <Link
                  href={`./app/tracker/${sidebarElementContainer.link}`}
                  className="flex flex-row pl-5 mt-1 py-1"
                >
                  <div className="mt-1 mr-2 text-2xl h-full self-center">
                    {" "}
                    {React.createElement(
                      sidebarElementContainer.IconComponent
                    )}{" "}
                  </div>
                  <div className="text-sm self-center">
                    {sidebarElementContainer.element}
                  </div>
                </Link>
              </li>
            );
        })}
        <li className="text-sm font-light text-gray-400 pl-5 mt-5">
          {" "}
          Support{" "}
        </li>
        {sidebarnavResponse.map((sidebarElementContainer) => {
          if (sidebarnavResponse.indexOf(sidebarElementContainer) > 9)
            return (
              <li key={sidebarElementContainer.id}>
                <Link
                  href={`./app/tracker/${sidebarElementContainer.link}`}
                  className="flex flex-row pl-5 mt-1 py-1"
                >
                  <div className="mt-1 mr-2 text-2xl h-full self-center">
                    {React.createElement(sidebarElementContainer.IconComponent)}
                  </div>
                  <div className="text-sm self-center">
                    {sidebarElementContainer.element}{" "}
                  </div>
                </Link>
              </li>
            );
        })}
      </ul>
    </nav>
  );
}
