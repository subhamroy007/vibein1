import { memo } from "react";
import { View } from "react-native";
import { shallowEqual } from "react-redux";
import { layoutStyle } from "../../styles";
import { COLOR_2, SIZE_90 } from "../../constants";
import Spinner from "./Spinner";
import PressableIconCircle from "./button/PressableIconCircle";

export type DefaultPlaceHolderProps = {
  height?: number;
  isLoading: boolean;
  fetch?: () => void;
};

const DefaultPlaceHolder = ({
  isLoading,
  height,
  fetch,
}: DefaultPlaceHolderProps) => {
  return (
    <View
      style={[
        layoutStyle.content_center,
        { height: height ? height : SIZE_90 },
      ]}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <PressableIconCircle onPress={fetch} name="add" color={COLOR_2} />
      )}
    </View>
  );
};

export default memo(DefaultPlaceHolder, (prev, next) =>
  shallowEqual(prev, next)
);
