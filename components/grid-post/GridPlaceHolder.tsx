import GridSkeliton from "./GridSkeliton";
import DefaultErrorFallback from "../utility-components/DefaultErrorFallback";

export type GridPlaceHolderProps = {
  height: number;
  isError: boolean;
  callback: () => void;
};

const GridPlaceHolder = ({
  callback,
  height,
  isError,
}: GridPlaceHolderProps) => {
  return isError ? (
    <DefaultErrorFallback retry={callback} height={height} />
  ) : (
    <GridSkeliton />
  );
};

export default GridPlaceHolder;
