import HeadBarContainer from "@/lib/trackerlayout/headbar";
import SidebarContainer from "@/lib/trackerlayout/sidebar";

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <HeadBarContainer />
        <SidebarContainer />
      </nav>
      <div>{children}</div>
    </div>
  );
}
