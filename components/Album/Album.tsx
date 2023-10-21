import { useCallback, useState } from "react";
import { PostPhotoParams } from "../../types/utility.types";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { AlbumPhoto } from "./AlbumPhoto";
import { layoutStyle } from "../../styles";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { COLOR_3, COLOR_8 } from "../../constants";

export type AlbumProps = {
  photos: PostPhotoParams[];
  containerAspectRatio: string;
  type?: "light" | "dark";
};

export default function Album({
  photos,
  containerAspectRatio,
  type,
}: AlbumProps) {
  const { width: screenWidth } = useWindowDimensions();

  const [photoIndex, setphotoIndex] = useState(0);

  const onMomentumScrollEndCallback = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newPhotoIndex = Math.floor(
        Math.floor(contentOffset.x) / Math.floor(screenWidth)
      );
      setphotoIndex(newPhotoIndex);
    },
    [setphotoIndex]
  );

  return (
    <Animated.ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      pagingEnabled
      overScrollMode="never"
      onMomentumScrollEnd={onMomentumScrollEndCallback}
      style={[layoutStyle.align_self_stretch, layoutStyle.flex_1]}
    >
      {photos.map((photo, index) => (
        <AlbumPhoto
          key={photo.url + index}
          containerAspectRatio={containerAspectRatio}
          {...photo}
          type={type}
        />
      ))}
      <LinearGradient
        style={[StyleSheet.absoluteFill]}
        colors={[COLOR_3, COLOR_8, COLOR_3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0.0, 0.4, 1.0]}
      />
    </Animated.ScrollView>
  );
}
