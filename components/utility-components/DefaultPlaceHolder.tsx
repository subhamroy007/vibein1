import { memo } from "react";
import { View } from "react-native";
import { shallowEqual } from "react-redux";
import { layoutStyle } from "../../styles";
import { COLOR_2, SIZE_90 } from "../../constants";
import IconCircle from "./icon/IconCircle";
import Spinner from "./Spinner";

export type DefaultPlaceHolderProps = {
  height?: number;
  isLoading: boolean;
};

const DefaultPlaceHolder = ({ isLoading, height }: DefaultPlaceHolderProps) => {
  return (
    <View
      style={[
        layoutStyle.content_center,
        { height: height ? height : SIZE_90 },
      ]}
    >
      {isLoading ? <Spinner /> : <IconCircle name="add" color={COLOR_2} />}
    </View>
  );
};

export default memo(DefaultPlaceHolder, (prev, next) =>
  shallowEqual(prev, next)
);
