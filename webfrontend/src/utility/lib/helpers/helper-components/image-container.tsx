interface ImageContainerProps {
  url: string | undefined;
  alt: string;
  placeholder: string;
}

/**
 * Acts as a component to format and display all pictures related to holding icons.
 * @param url The source for the holding logo image.
 * @param alt
 * @param placeholder A placeholder as long as no source is known, or the source is not reachable.
 * @returns
 */
export const HoldingLogoImageContainer = ({
  placeholder,
}: ImageContainerProps) => {
  /*<Image src={props.url} width={props.width} height={props.height} alt={props.alt}/> */
  return <div> {placeholder} </div>;
};

/**
 * Acts as a component to format and display small nfts.
 * @param url The source for the holding logo image.
 * @param alt
 * @param placeholder A placeholder as long as no source is known, or the source is not reachable.
 * @returns
 */
export const NftDetailImageContainer = ({
  placeholder,
}: ImageContainerProps) => {
  /*<Image src={props.url} width={props.width} height={props.height} alt={props.alt}/> */
  return (
    <div className="flex flex-row card h-11 w-11 justify-center items-center m-l border border-black mr-3 ml-5 ">
      {" "}
      {placeholder}
    </div>
  );
};
