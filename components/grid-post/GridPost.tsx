import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {
  COLOR_1,
  GRID_WIDTHx3,
  SIZE_11,
  SIZE_15,
  SIZE_6,
} from "../../constants";
import { backgroundStyle, layoutStyle } from "../../styles";

import { formatNumber } from "../../utility";
import { useCallback, useMemo, useState } from "react";
import { PostItemIdentifier } from "../../types/store.types";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectPostPreview } from "../../store/post-store/post.selectors";
import Photo from "../Photo";
import Icon from "../utility-components/icon/Icon";
import Text from "../utility-components/text/Text";

export type GridPostProps = {
  index: number;
  onPress: (id: string, index: number) => void;
  portrait?: boolean;
  showPin?: boolean;
  showViews?: boolean;
  id: string;
};

export function GridPost({
  portrait,
  showPin,
  showViews,
  index,
  onPress,
  id,
}: GridPostProps) {
  const post = useAppSelector((state) => selectPostPreview(state, id));

  const [isPreviewVisible, setPreviewVisibleState] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(true);

  const imageLoadCallback = useCallback(() => setImageLoaded(true), []);

  const togglePreviewVisibleState = useCallback(
    () => setPreviewVisibleState((prevState) => !prevState),
    []
  );

  const pressCallback = useCallback(() => {
    onPress(id, index);
  }, [id, index]);

  // const longPressCallback = useCallback(() => {
  //   Vibration.vibrate(LONG_PRESS_VIBRATION_DURATION);
  //   togglePreviewVisibleState();
  // }, []);

  // useBackHandler(() => {
  //   if (isPreviewVisible) {
  //     togglePreviewVisibleState();
  //     return true;
  //   }
  //   return false;
  // });

  const rootContainerCachedStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      {
        aspectRatio: portrait ? "9/16" : "1/1",
        width: GRID_WIDTHx3,
      },
      backgroundStyle.background_dove_grey,
    ],
    [portrait]
  );

  if (!post) {
    return null;
  }

  return (
    <Pressable onPress={pressCallback} style={rootContainerCachedStyle}>
      <Photo
        uri={
          post.type === "photo-post"
            ? post.firstPhoto.preview
            : post.video.poster.uri
        }
        style={layoutStyle.fill}
        placeholder={
          post.type === "photo-post"
            ? post.firstPhoto.blurhash
            : post.video.poster.blurhash
        }
      />
      {imageLoaded && (
        <>
          {post.type === "photo-post" ? (
            post.isAlbum && (
              <Icon
                name="copy-solid"
                size={SIZE_15}
                color={COLOR_1}
                style={styles.albumIcon}
              />
            )
          ) : (
            <Icon
              name="moment-solid"
              size={SIZE_15}
              color={COLOR_1}
              style={styles.albumIcon}
            />
          )}
          {post.isPinned && showPin && (
            <Icon
              name="pin-solid"
              size={SIZE_15}
              color={COLOR_1}
              style={styles.pinIcon}
            />
          )}
          {post.type === "moment-post" && post.noOfViews > 0 && showViews && (
            <View style={styles.views_container}>
              <Text size={SIZE_11} color={COLOR_1} weight="regular">
                {formatNumber(post.noOfViews)}
              </Text>
              <Icon name="play" size={SIZE_15} color={COLOR_1} />
            </View>
          )}
        </>
      )}
    </Pressable>
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
});
