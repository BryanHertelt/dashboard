"use client";

import { sidebarnavResponse } from "@/api/sidebarnavAPI";
import Link from "next/link";
import { LogoIcon, FoldSideBarIcon } from "../../../public/images";

export default function SidebarContainer() {
  return (
    <nav className="flex flex-col h-full border border-red-300 w-full ">
      <header className="flex flex-row justify-start m-2.5 my-3.5 align-baseline">
        <LogoIcon className="text-4xl" />
        <h1 className="text-3xl font-semibold"> Flyzer </h1>
        <div className="w-1/2 bg-black">
          <FoldSideBarIcon className="text-4xl" />
        </div>
      </header>
      <hr />
      <ul>
        <li className="text-1xl font-light text-gray-400"> General </li>
        {sidebarnavResponse.map((sidebarElementContainer) => {
          if (sidebarnavResponse.indexOf(sidebarElementContainer) <= 9)
            return (
              <li key={sidebarElementContainer.id}>
                <Link href={`./app/tracker/${sidebarElementContainer.link}`}>
                  {console.log(sidebarElementContainer.icon)}
                  {sidebarElementContainer.element}
                </Link>
              </li>
            );
        })}
        <li> Support </li>
        {sidebarnavResponse.map((sidebarElementContainer) => {
          if (sidebarnavResponse.indexOf(sidebarElementContainer) > 9)
            return (
              <li key={sidebarElementContainer.id}>
                <Link href={`./app/tracker/${sidebarElementContainer.link}`}>
                  {" "}
                  {sidebarElementContainer.element}{" "}
                </Link>
              </li>
            );
        })}
      </ul>
    </nav>
  );
}
