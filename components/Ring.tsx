import { StyleSheet, View } from "react-native";
import { borderStyle, layoutStyle } from "../styles";
import { SIZE_90 } from "../constants";

export type RingProps = {
  size?: number;
};

export default function Ring({ size }: RingProps) {
  const ringSize = size ? size : SIZE_90;

  return (
    <View
      style={{
        width: ringSize,
        height: ringSize,
        borderRadius: ringSize * 0.5,
        borderWidth: 4 * StyleSheet.hairlineWidth,
        ...borderStyle.border_color_7,
        ...layoutStyle.position_absolute,
      }}
    />
  );
}
