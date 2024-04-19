import { Image, ImageStyle } from "expo-image";
import { StyleProp } from "react-native";
import { SIZE_36 } from "../constants";
import Photo from "./Photo";

export type AvatarProps = {
  url: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export default function Avatar({ url, size, style }: AvatarProps) {
  const avatarSize = size ? size : SIZE_36;

  return (
    <Photo
      style={[
        style,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        },
      ]}
      uri={url}
    />
  );
}
