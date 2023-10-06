import { Image, ImageStyle } from "expo-image";
import { StyleProp } from "react-native";
import { SIZE_36 } from "../constants";

export type AvatarProps = {
  url: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export default function Avatar({ url, size, style }: AvatarProps) {
  const avatarSize = size ? size : SIZE_36;

  return (
    <Image
      style={[
        style,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        },
      ]}
      source={url}
    />
  );
}
