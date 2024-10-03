import SidebarContainer from "@/lib/trackerlayout/sidebar";

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav>
        <SidebarContainer />
      </nav>
      {children}
    </>
  );
}
