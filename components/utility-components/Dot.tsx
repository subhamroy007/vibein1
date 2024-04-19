import { StyleProp, View, ViewStyle } from "react-native";
import { COLOR_4, SIZE_6 } from "../../constants";

export type DotProps = {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export default function Dot({ color, size, style }: DotProps) {
  const calculatedSize = size ? size : SIZE_6;
  const calculatedColor = color ? color : COLOR_4;

  return (
    <View
      style={[
        [
          {
            width: calculatedSize,
            height: calculatedSize,
            borderRadius: calculatedSize,
            backgroundColor: calculatedColor,
          },
          style,
        ],
      ]}
    />
  );
}
