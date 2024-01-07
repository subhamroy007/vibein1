import { Pressable, StyleSheet, Vibration, View } from "react-native";
import { useGridPost } from "../../hooks/post.hooks";
import {
  COLOR_1,
  LONG_PRESS_VIBRATION_DURATION,
  POST_GRID_WIDTH,
  SIZE_11,
  SIZE_15,
  SIZE_6,
} from "../../constants";
import { backgroundStyle, layoutStyle } from "../../styles";
import Icon from "../Icon";
import AppText from "../AppText";
import { formatNumber } from "../../utility";
import { useCallback, useState } from "react";
import { Portal } from "@gorhom/portal";
import PostPreview from "../preview-post/PostPreview2";
import RetryableImage from "../RetryableImage";
import { useBackHandler } from "@react-native-community/hooks";

export type GridPostProps = {
  id: string;
  first: boolean;
  portrait?: boolean;
  showPin?: boolean;
  showViews?: boolean;
  onPress: (id: string) => void;
  onPreviewPress: (id: string) => void;
};

export function GridPost({
  id,
  first,
  portrait,
  showPin,
  showViews,
  onPress,
  onPreviewPress,
}: GridPostProps) {
  const { postParams } = useGridPost(id);

  const [isPreviewVisible, setPreviewVisibleState] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);

  const imageLoadCallback = useCallback(() => setImageLoaded(true), []);

  const togglePreviewVisibleState = useCallback(
    () => setPreviewVisibleState((prevState) => !prevState),
    []
  );

  const pressCallback = useCallback(() => {
    onPress(id);
  }, [id, onPress]);

  const longPressCallback = useCallback(() => {
    Vibration.vibrate(LONG_PRESS_VIBRATION_DURATION);
    togglePreviewVisibleState();
  }, []);

  const previewPressCallback = useCallback(() => {
    onPreviewPress(id);
  }, [onPreviewPress, id]);

  useBackHandler(() => {
    if (isPreviewVisible) {
      togglePreviewVisibleState();
      return true;
    }
    return false;
  });

  if (!postParams) {
    return null;
  }

  return (
    <>
      <Pressable
        delayLongPress={200}
        onPress={pressCallback}
        onLongPress={longPressCallback}
        style={[
          {
            aspectRatio: portrait ? "9/16" : "1/1",
            marginLeft: first ? 0 : 3 * StyleSheet.hairlineWidth,
          },
          styles.root_container,
        ]}
      >
        <RetryableImage
          source={
            postParams.postType === "photo"
              ? postParams.previewUrl
              : postParams.thumbnailPreviewUrl
          }
          style={styles.image}
          onLoad={imageLoadCallback}
        />
        {imageLoaded && (
          <>
            {postParams.postType === "photo" && postParams.isAlbum && (
              <Icon
                name="album"
                size={SIZE_15}
                color={COLOR_1}
                style={styles.albumIcon}
              />
            )}
            {postParams.isPinned && showPin && (
              <Icon
                name="pin-solid"
                size={SIZE_15}
                color={COLOR_1}
                style={styles.pinIcon}
              />
            )}
            {postParams.postType === "moment" &&
              postParams.noOfViews > 0 &&
              showViews && (
                <View style={styles.views_container}>
                  <AppText size={SIZE_11} color={COLOR_1} weight="regular">
                    {formatNumber(postParams.noOfViews)}
                  </AppText>
                  <Icon name="play-outlne" size={SIZE_15} color={COLOR_1} />
                </View>
              )}
          </>
        )}
      </Pressable>
      {isPreviewVisible && (
        <Portal>
          <PostPreview
            id={id}
            onDismiss={togglePreviewVisibleState}
            onPress={previewPressCallback}
          />
        </Portal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  albumIcon: {
    ...layoutStyle.position_absolute,
    top: SIZE_6,
    left: SIZE_6,
  },
  pinIcon: {
    ...layoutStyle.position_absolute,
    top: SIZE_6,
    right: SIZE_6,
  },
  views_container: {
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.align_item_center,
    ...layoutStyle.position_absolute,
    bottom: 6,
    right: 6,
  },
  root_container: {
    ...backgroundStyle.background_color_7,
    width: POST_GRID_WIDTH,
  },
  image: {
    ...layoutStyle.width_100_percent,
    ...layoutStyle.height_100_percent,
  },
});
