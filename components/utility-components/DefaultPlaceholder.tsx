import { View } from "react-native";
import { COLOR_2, SIZE_90 } from "../../constants";
import { layoutStyle } from "../../styles";
import Spinner from "./Spinner";
import PressableIconCircle from "./button/PressableIconCircle";

export type DefaultPlaceHolderProps = {
  height?: number;
  callback: () => void;
  isLoading: boolean;
  isError: boolean;
};

export default function DefaultPlaceholder({
  callback,
  isError,
  isLoading,
  height,
}: DefaultPlaceHolderProps) {
  return (
    <View style={[{ height: height || SIZE_90 }, layoutStyle.content_center]}>
      {isLoading ? (
        <Spinner />
      ) : (
        <PressableIconCircle
          name={isError ? "retry" : "add"}
          onPress={callback}
          color={COLOR_2}
        />
      )}
    </View>
  );
}
