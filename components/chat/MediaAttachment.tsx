import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { backgroundStyle, borderStyle, layoutStyle } from "../../styles";
import { MessageMediaAttachmentParams } from "../../types/store.types";
import RetryableImage from "../RetryableImage";
import AppText from "../AppText";
import { COLOR_1, SIZE_20 } from "../../constants";
import BasicPressable from "../pressables/BasicPressable";
import { useCallback, useMemo, useState } from "react";
import { Portal } from "@gorhom/portal";
import MediaAttachmentViewer from "./MediaAttachmentViewer";
import { useBackHandler } from "@react-native-community/hooks";

const MediaAttachment = ({
  files,
}: {
  files: MessageMediaAttachmentParams[];
}) => {
  const [mediaViewerVisible, setMediaViewerVisibleState] = useState(false);

  const { width: screenWidth } = useWindowDimensions();

  const toggleMediaViewerVisibleState = useCallback(
    () => setMediaViewerVisibleState((prevState) => !prevState),
    []
  );

  useBackHandler(() => {
    if (mediaViewerVisible) {
      toggleMediaViewerVisibleState();
      return true;
    }
    return false;
  });

  const containerWidth = screenWidth * 0.7;

  const firstImageAspectRatio =
    files[0].width / files[0].height < 3 / 4
      ? 3 / 4
      : files[0].width / files[0].height;

  const containerHeight =
    files.length === 1
      ? containerWidth / firstImageAspectRatio
      : containerWidth;

  const imageUrl = files[0].type === "photo" ? files[0].url : files[0].poster;

  const root_container_cached_style = useMemo<StyleProp<ViewStyle>>(
    () => [
      layoutStyle.flex_wrap,
      borderStyle.border_radius_12,
      layoutStyle.overflow_hidden,
      { width: containerWidth, height: containerHeight },
    ],
    [containerWidth, containerHeight]
  );

  const first_image_cached_style = useMemo<StyleProp<ImageStyle>>(
    () => ({ width: containerWidth, height: containerHeight }),
    [containerWidth, containerHeight]
  );

  const grid_image_cached_style = useMemo<StyleProp<ImageStyle>>(
    () => ({ width: containerWidth / 2, height: containerWidth / 2 }),
    [containerWidth]
  );

  return (
    <BasicPressable
      style={root_container_cached_style}
      onPress={toggleMediaViewerVisibleState}
    >
      {files.length === 1 ? (
        <RetryableImage style={first_image_cached_style} source={imageUrl} />
      ) : (
        <>
          {files.slice(0, 4).map((media, index) => (
            <RetryableImage
              style={grid_image_cached_style}
              source={media.type === "photo" ? media.url : media.poster}
              key={media.url + index}
            />
          ))}
          {files.length > 4 ? (
            <View style={media_count_container_style}>
              <AppText size={SIZE_20} color={COLOR_1}>
                + {files.length - 4}
              </AppText>
            </View>
          ) : undefined}
        </>
      )}

      {mediaViewerVisible && (
        <Portal>
          <MediaAttachmentViewer
            onClose={toggleMediaViewerVisibleState}
            files={files}
          />
        </Portal>
      )}
    </BasicPressable>
  );
};

const styles = StyleSheet.create({
  media_count_container: {
    aspectRatio: "1/1",
    width: "50%",
    bottom: 0,
    right: 0,
  },
});

const media_count_container_style: StyleProp<ViewStyle> = [
  styles.media_count_container,
  backgroundStyle.background_color_3,
  layoutStyle.position_absolute,
  layoutStyle.align_item_center,
  layoutStyle.justify_content_center,
];

export default MediaAttachment;
