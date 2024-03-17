import { GestureDetector } from "react-native-gesture-handler";
import { PostPhotoAdapterParams } from "../../types/store.types";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { COLOR_15, COLOR_8 } from "../../constants";
import Photo from "../Photo";
import { layoutStyle } from "../../styles";
import { useDeviceLayout } from "../../hooks/utility.hooks";

export type PhotoAlbumItemProps = {
  showTags: boolean;
  autoRetry: boolean;
} & PostPhotoAdapterParams;

const PhotoAlbumItem = ({ uri, blurhash, autoRetry }: PhotoAlbumItemProps) => {
  const { width } = useDeviceLayout();

  return (
    <Animated.View style={{ width, height: "100%" }}>
      <Photo
        autoRetry={autoRetry}
        style={layoutStyle.fill}
        uri={uri}
        placeholder={blurhash}
      />
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={[COLOR_8, COLOR_8, COLOR_15]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.6, 1]}
      />
    </Animated.View>
  );
};

export default PhotoAlbumItem;
