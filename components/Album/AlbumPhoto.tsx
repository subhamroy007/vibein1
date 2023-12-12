import { StyleSheet, View, useWindowDimensions } from "react-native";
import { PostPhotoParams } from "../../types/utility.types";
import { COLOR_2, SIZE_90 } from "../../constants";
import { backgroundStyle, layoutStyle } from "../../styles";
import { Image } from "expo-image";
import { useImageCache } from "../../hooks/utility.hooks";

type AlbumphotoProps = {} & PostPhotoParams;

export function AlbumPhoto({ url, previewUrl }: AlbumphotoProps) {
  const { width: screenWidth } = useWindowDimensions();

  const { downloadState, fileUrl } = useImageCache(url, true);

  return (
    <View
      style={[
        {
          width: screenWidth,
        },
        styles.root_container,
      ]}
    >
      {downloadState === "success" && fileUrl && (
        <Image
          style={[styles.original_image]}
          source={fileUrl}
          contentFit={"cover"}
        />
      )}

      {downloadState !== "success" && <View style={[styles.loadingRing]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRing: {
    width: SIZE_90,
    height: SIZE_90,
    borderRadius: SIZE_90 * 0.5,
    borderWidth: 2 * StyleSheet.hairlineWidth,
    borderColor: COLOR_2,
    ...layoutStyle.position_absolute,
  },
  root_container: {
    ...layoutStyle.height_100_percent,
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_center,
  },
  original_image: {
    ...layoutStyle.width_100_percent,
    ...layoutStyle.height_100_percent,
  },
});
