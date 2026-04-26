import { redirect } from "next/navigation";

const HomePage = () => {
  redirect("/tracker/asset-distribution");
};

export default HomePage;
