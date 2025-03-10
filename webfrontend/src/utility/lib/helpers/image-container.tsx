import Image from "next/image";

interface ImageContainerProps {
  url: string | undefined;
  alt: string;
  placeholder: string;
}

export const HoldingLogoImageContainer = (props: ImageContainerProps) => {
  /*<Image src={props.url} width={props.width} height={props.height} alt={props.alt}/> */
  return <div> {props.placeholder} </div>;
};

export const NftDetailImageContainer = (props: ImageContainerProps) => {
  /*<Image src={props.url} width={props.width} height={props.height} alt={props.alt}/> */
  return (
    <div className="flex flex-row card h-11 w-11 justify-center items-center m-l border border-black mr-3 ml-5 ">
      {" "}
      {props.placeholder}
    </div>
  );
};
