import { StyleProp, View, ViewStyle } from "react-native";
import { COLOR_11, COLOR_12, SIZE_40, SIZE_60, SIZE_90 } from "../constants";
import { layoutStyle } from "../styles";
import { Circle, Defs, LinearGradient, Stop, Svg } from "react-native-svg";
import Avatar from "./Avatar";

export type OutlinedAvatarProps = {
  url: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function OutlinedAvatar({
  url,
  size,
  style,
}: OutlinedAvatarProps) {
  const ringSize = size ? size : SIZE_40;

  let outlineWidth = ringSize * 0.0375;

  if (ringSize >= SIZE_60 && ringSize < SIZE_90) {
    outlineWidth = ringSize * 0.0325;
  } else {
    outlineWidth = ringSize * 0.0275;
  }

  const avatarSize = ringSize - outlineWidth * 3.75;

  const gradientColors = [COLOR_11, COLOR_12];

  const ringRadius = ringSize / 2 - outlineWidth / 2;

  return (
    <View
      style={[
        style,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
      ]}
    >
      <Svg width={ringSize} height={ringSize}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {gradientColors.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index * 100) / (gradientColors.length - 1)}%`}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={ringRadius}
          stroke="url(#gradient)"
          strokeWidth={outlineWidth}
          fill={"transparent"}
        />
      </Svg>
      <Avatar
        size={avatarSize}
        url={url}
        style={layoutStyle.position_absolute}
      />
    </View>
  );
}
