import { ColorRing } from "react-loader-spinner";

interface Props {
  width?: string;
  height?: string;
}

const Loader = ({ height, width }: Props) => {
  return (
    <ColorRing
      visible={true}
      height={height ? height : "60"}
      width={width ? width : "60"}
      ariaLabel="color-ring-loading"
      wrapperStyle={{}}
      wrapperClass="color-ring-wrapper"
      colors={["#009B3A", "#FEDF00", "#002776", "#FFF", "#009B3A"]}
    />
  );
};

export default Loader;
