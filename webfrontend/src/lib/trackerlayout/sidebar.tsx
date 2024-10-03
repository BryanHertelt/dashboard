import { sidebarnavResponse } from "@/api/sidebarnavAPI";
import Link from "next/link";

export default function SidebarContainer() {
  return (
    <>
      <h1> Flyzer </h1>
      <ul>
        {sidebarnavResponse.map((sidebarElementContainer) => {
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
    </>
  );
}
