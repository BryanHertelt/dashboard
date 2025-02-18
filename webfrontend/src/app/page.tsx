import Link from "next/link";

const HomePage = () => {
  return (
    <>
      <p> Welcome in Flyzer</p>
      <Link href={"/tracker"}> Click here to go to the tracker </Link>
    </>
  );
};

export default HomePage;
