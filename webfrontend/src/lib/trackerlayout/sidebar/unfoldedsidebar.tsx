import React from "react";
import Link from "next/link";
import { sidebarnavResponse } from "@/api/sidebarnavAPI";

const UnfoldedSidebar = () => {
  return (
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
      <li className="text-sm font-light text-gray-400 pl-5 mt-5"> Support </li>
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
  );
};

export default UnfoldedSidebar;
