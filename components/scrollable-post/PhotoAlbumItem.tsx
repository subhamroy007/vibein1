import Animated from "react-native-reanimated";
import { useDeviceLayout } from "../../hooks/utility.hooks";
import { PhotoWithHash } from "../../types/utility.types";
import Photo from "../Photo";
import { layoutStyle } from "../../styles";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { COLOR_15, COLOR_8 } from "../../constants";

export type PhotoAlbumItemProps = PhotoWithHash & { preload: boolean };

const PhotoAlbumItem = ({ blurhash, uri, preload }: PhotoAlbumItemProps) => {
  const { width } = useDeviceLayout();

  return (
    <Animated.View style={{ width, aspectRatio: "2/3" }}>
      <Photo
        uri={uri}
        placeholder={blurhash}
        style={layoutStyle.fill}
        showLoadingRing
        autoRetry={preload}
      />
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={[COLOR_15, COLOR_8, COLOR_8, COLOR_15]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.2, 0.8, 1]}
      />
    </Animated.View>
  );
};

export default PhotoAlbumItem;
