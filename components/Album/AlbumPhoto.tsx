import { StyleSheet, View } from "react-native";
import { OutdatedPhotoParams1 } from "../../types/utility.types";
import { COLOR_2, SIZE_90 } from "../../constants";
import { layoutStyle } from "../../styles";
import { useDeviceLayout } from "../../hooks/utility.hooks";
import RetryableImage from "../RetryableImage";
import { useCallback, useState } from "react";
import { ThunkState } from "../../types/store.types";

type AlbumphotoProps = {} & OutdatedPhotoParams1;

export function AlbumPhoto({ url, previewUrl }: AlbumphotoProps) {
  const { width: imageWidth } = useDeviceLayout();

  const [showLoadingRing, setLoadingRingStatus] = useState(false);

  const stateChangeCallback = useCallback((currentState: ThunkState) => {
    setLoadingRingStatus(currentState === "loading");
  }, []);

  return (
    <View
      style={[
        {
          width: imageWidth,
        },
        styles.root_container,
      ]}
    >
      <RetryableImage
        source={url}
        onStateChange={stateChangeCallback}
        style={[styles.original_image]}
      />
      {showLoadingRing && <View style={[styles.loadingRing]} />}
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
