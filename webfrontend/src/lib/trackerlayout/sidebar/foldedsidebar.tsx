import React from "react";
import Link from "next/link";
import { sidebarnavResponse } from "@/api/sidebarnavAPI";

const FoldedSideBar = () => {
  return (
    <ul className="mt-5">
      <li className="text-sm font-light text-gray-400 pl-3"> General </li>
      {sidebarnavResponse.map((sidebarElementContainer) => {
        if (sidebarnavResponse.indexOf(sidebarElementContainer) < 9)
          return (
            <li key={sidebarElementContainer.id}>
              <Link
                href={`./app/tracker/${sidebarElementContainer.link}`}
                className="flex flex-row pl-5 mt-1 py-1 justify-start"
              >
                <div className="mt-1 mr-2 text-2xl h-full self-center">
                  {" "}
                  {React.createElement(
                    sidebarElementContainer.IconComponent
                  )}{" "}
                </div>
              </Link>
            </li>
          );
      })}
      <li className="text-sm font-light text-gray-400 pl-3 mt-5"> Support </li>
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
              </Link>
            </li>
          );
      })}
    </ul>
  );
};

export default FoldedSideBar;
