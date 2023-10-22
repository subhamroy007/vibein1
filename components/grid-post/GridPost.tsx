import { Pressable, StyleSheet, Vibration, View } from "react-native";
import { useGridPost } from "../../hooks/post.hooks";
import {
  COLOR_1,
  LONG_PRESS_VIBRATION_DURATION,
  POST_GRID_WIDTH,
  SIZE_11,
  SIZE_12,
  SIZE_15,
} from "../../constants";
import { Image } from "expo-image";
import { backgroundStyle, layoutStyle } from "../../styles";
import Icon from "../Icon";
import AppText from "../AppText";
import { formatNumber } from "../../utility";
import { usePhotoFetch } from "../../hooks/utility.hooks";
import { useCallback } from "react";

export type GridPostProps = {
  id: string;
  first: boolean;
  portrait?: boolean;
  showPin?: boolean;
  showViews?: boolean;
  onPress: (id: string) => void;
  onLongPress: (id: string) => void;
};

export function GridPost({
  id,
  first,
  portrait,
  showPin,
  showViews,
  onLongPress,
  onPress,
}: GridPostProps) {
  const { postParams } = useGridPost(id);

  const {
    photoLoadCallback,
    photoLoadErrorCallback,
    photoLoadStartCallback,
    photoLoadingState,
  } = usePhotoFetch(true);

  const pressCallback = useCallback(() => {
    onPress(id);
  }, [id, onPress]);

  const longPressCallback = useCallback(() => {
    Vibration.vibrate(LONG_PRESS_VIBRATION_DURATION);
    onLongPress(id);
  }, [id, onLongPress]);

  if (!postParams) {
    return null;
  }

  const { previewUrl, isAlbum, isPinned, noOfViews } = postParams;

  return (
    <Pressable
      delayLongPress={300}
      onPress={pressCallback}
      onLongPress={longPressCallback}
      style={[
        {
          aspectRatio: portrait ? "9/16" : "1/1",
          width: POST_GRID_WIDTH,
          marginLeft: first ? 0 : 3 * StyleSheet.hairlineWidth,
        },
        backgroundStyle.background_color_7,
      ]}
    >
      {photoLoadingState !== "failed" && (
        <Image
          contentFit="cover"
          source={previewUrl}
          style={[
            layoutStyle.width_100_percent,
            layoutStyle.height_100_percent,
          ]}
          onLoad={photoLoadCallback}
          onLoadStart={photoLoadStartCallback}
          onError={photoLoadErrorCallback}
        />
      )}
      {photoLoadingState === "success" && (
        <>
          {isAlbum && (
            <Icon
              name="album"
              size={SIZE_15}
              color={COLOR_1}
              style={[layoutStyle.position_absolute, { top: 6, left: 6 }]}
            />
          )}
          {isPinned && showPin && (
            <Icon
              name="pin-solid"
              size={SIZE_15}
              color={COLOR_1}
              style={[layoutStyle.position_absolute, { top: 6, right: 6 }]}
            />
          )}
          {noOfViews > 0 && showViews && (
            <View
              style={[
                layoutStyle.flex_direction_row,
                layoutStyle.align_item_center,
                layoutStyle.position_absolute,
                { bottom: 6, right: 6 },
              ]}
            >
              <AppText size={SIZE_11} color={COLOR_1} weight="regular">
                {formatNumber(noOfViews)}
              </AppText>
              <Icon name="play-outlne" size={SIZE_15} color={COLOR_1} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
