import HeadBarContainer from "@/lib/trackerlayout/headbar";
import SidebarContainer from "@/lib/trackerlayout/sidebar/sidebar";

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-row justify-start h-screen">
      <SidebarContainer />
      <div className="flex flex-col justify-start w-10/12 h-screen flex-grow">
        <nav className="flex flex-row justify-end h-16 drop-shadow-sm  shadow-gray-100">
          <HeadBarContainer />
        </nav>
        <article className="flex flex-row justify-center bg-backgroundchild w-full h-screen">
          {children}
        </article>
      </div>
    </section>
  );
}
