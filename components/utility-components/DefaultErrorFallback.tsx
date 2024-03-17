import { memo } from "react";
import { View } from "react-native";
import { shallowEqual } from "react-redux";
import { layoutStyle } from "../../styles";
import { COLOR_2, SIZE_90 } from "../../constants";
import PressableIconCircle from "./button/PressableIconCircle";

export type DefaultErrorFallbackProps = {
  height?: number;
  retry: () => void;
};

const DefaultErrorFallback = ({ retry, height }: DefaultErrorFallbackProps) => {
  return (
    <View
      style={[
        layoutStyle.content_center,
        { height: height ? height : SIZE_90 },
      ]}
    >
      <PressableIconCircle name={"retry"} onPress={retry} color={COLOR_2} />
    </View>
  );
};

export default memo(DefaultErrorFallback, (prev, next) =>
  shallowEqual(prev, next)
);
