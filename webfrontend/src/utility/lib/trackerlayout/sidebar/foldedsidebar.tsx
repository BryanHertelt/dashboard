import React from "react";
import Link from "next/link";
import { sidebarelementinterface } from "@/api/sidebarnavAPI";

export interface propsInterface {
  sidebarnavResponse: sidebarelementinterface[];
}

export const renderFoldedBulletPoints = (
  sidebarElementContainer: sidebarelementinterface
) => {
  return (
    <li key={sidebarElementContainer.id} className="flex justify-center">
      {/** 
      <Link href={`/tracker/${sidebarElementContainer.link}`}>
        <a
          className="flex flex-row mt-1 py-1 justify-center align-middle pl-2 text-icongray
          hover:bg-blue hover:text-white hover:w-6/12 hover:rounded-md
          focus:bg-blue focus:text-white focus:rounded-md"
        >
          <div className="mt-1 mr-2 text-2xl h-full self-center">
            {React.createElement(sidebarElementContainer.IconComponent)}
          </div>
        </a>
      </Link>
      */}
    </li>
  );
};

/**
 * This component defines how the folded Sidebar looks like.
 * @returns A smaller version of the sidebar, where you can just see the icons and small headings, as well as the Logo.
 */
const FoldedSideBar = (props: propsInterface) => {
  return (
    <ul className="mt-5">
      <li className="text-sm font-light text-gray-400 pl-3"> General </li>
      {props.sidebarnavResponse.map((sidebarElementContainer) => {
        if (props.sidebarnavResponse.indexOf(sidebarElementContainer) <= 9)
          return renderFoldedBulletPoints(sidebarElementContainer);
      })}
      <li className="text-sm font-light text-gray-400 pl-3 mt-5"> Support </li>
      {props.sidebarnavResponse.map((sidebarElementContainer) => {
        if (props.sidebarnavResponse.indexOf(sidebarElementContainer) > 9)
          return renderFoldedBulletPoints(sidebarElementContainer);
      })}
    </ul>
  );
};

export default FoldedSideBar;
