import { Image } from "expo-image";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { SIZE_18, SIZE_20, SIZE_30, SIZE_36 } from "../constants";

interface AppAvatarProps {
  url: string;
  size?: "small" | "medium" | "large" | "extra-small";
  style?: StyleProp<ViewStyle>;
}

export default function AppAvatar({ size, url, style }: AppAvatarProps) {
  let strokeWidth;
  let outerRadius;

  switch (size) {
    case "large":
      strokeWidth = 2.5;
      outerRadius = SIZE_36;
      break;
    case "medium":
      strokeWidth = 2;
      outerRadius = SIZE_30;
      break;
    case "extra-small":
      strokeWidth = 1.5;
      outerRadius = SIZE_18;
      break;
    case "small":
    default:
      strokeWidth = 1.5;
      outerRadius = SIZE_20;
      break;
  }

  const imageSize = outerRadius * 2 - strokeWidth * 4;

  const ringRadius = outerRadius - strokeWidth / 2;

  const gradientColors = ["#2EF642", "#1E6ADC"];

  return (
    <View style={[style, styles.container]}>
      <Svg width={outerRadius * 2} height={outerRadius * 2}>
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
          cx={outerRadius}
          cy={outerRadius}
          r={ringRadius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill={"transparent"}
        />
      </Svg>
      <Image
        source={url}
        contentFit="cover"
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
          position: "absolute",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
