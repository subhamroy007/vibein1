import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import {
  borderStyle,
  layoutStyle,
  paddingStyle,
  backgroundStyle,
  marginStyle,
} from "../../styles";
import Icon from "../Icon";
import {
  COLOR_4,
  COLOR_6,
  SIZE_12,
  SIZE_24,
  SIZE_30,
  SIZE_42,
} from "../../constants";
import { usePostPreview } from "../../hooks/post.hooks";
import AppPressable from "../AppPressable";
import Avatar from "../Avatar";
import AppText from "../AppText";
import { Image } from "expo-image";
import Ring from "../Ring";
import { usePhotoFetch } from "../../hooks/utility.hooks";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { BlurView } from "expo-blur";

export type PostPreviewProps = {
  id: string;
  onDismiss: () => void;
  onPress: () => void;
};

export default function PostPreview({
  id,
  onDismiss,
  onPress,
}: PostPreviewProps) {
  const { postParams, togglePostLikeStateCallback } = usePostPreview(id);

  const {
    photoLoadCallback: originalPhotoLoadCallback,
    photoLoadErrorCallback: originalPhotoLoadErrorCallback,
    photoLoadStartCallback: originalPhotoLoadStartCallback,
    photoLoadingState: originalPhotoLoadingState,
  } = usePhotoFetch(true);

  const {
    photoLoadCallback: previewPhotoLoadCallback,
    photoLoadErrorCallback: previewPhotoLoadErrorCallback,
    photoLoadStartCallback: previewPhotoLoadStartCallback,
    photoLoadingState: previewPhotoLoadingState,
  } = usePhotoFetch(true);

  if (!postParams) {
    return null;
  }

  const { createdBy, isLiked, originalUrl, previewUrl } = postParams;

  return (
    <Pressable
      style={[styles.root_container, StyleSheet.absoluteFill]}
      onPress={onDismiss}
    >
      <BlurView style={StyleSheet.absoluteFill} intensity={18} tint="light" />
      <Animated.View
        style={[styles.content_container]}
        entering={ZoomIn.duration(300)}
        exiting={ZoomOut.duration(300)}
      >
        <View style={styles.header}>
          <Avatar url={createdBy.profilePictureUrl} size={SIZE_30} />
          <AppText style={marginStyle.margin_left_6} size={SIZE_12}>
            {createdBy.username}
          </AppText>
        </View>
        <Pressable style={styles.body} onPress={onPress}>
          {originalPhotoLoadingState !== "success" && (
            <>
              {previewPhotoLoadingState !== "success" && <Ring />}
              {previewPhotoLoadingState !== "failed" && (
                <Image
                  source={previewUrl}
                  style={[styles.preview]}
                  onLoadStart={previewPhotoLoadStartCallback}
                  onError={previewPhotoLoadErrorCallback}
                  onLoad={previewPhotoLoadCallback}
                />
              )}
            </>
          )}
          {originalPhotoLoadingState !== "failed" && (
            <Image
              source={originalUrl}
              style={[styles.photo]}
              onLoadStart={originalPhotoLoadStartCallback}
              onError={originalPhotoLoadErrorCallback}
              onLoad={originalPhotoLoadCallback}
            />
          )}
        </Pressable>
        <View style={styles.footer}>
          <AppPressable hitSlop={SIZE_24} onPress={togglePostLikeStateCallback}>
            <Icon
              name={isLiked ? "heart-solid" : "heart-outline"}
              color={isLiked ? COLOR_6 : COLOR_4}
              size={SIZE_24}
            />
          </AppPressable>
          <Icon name="comment" size={SIZE_24} />
          <Icon name="send-outline" size={SIZE_24} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root_container: {
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_center,
  },
  content_container: {
    width: "85%",
    aspectRatio: "9/14",
    ...backgroundStyle.background_color_1,
    ...borderStyle.border_radius_9,
  },
  footer: {
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_space_around,
    ...layoutStyle.flex_direction_row,
    height: SIZE_42,
  },
  header: {
    height: SIZE_42,
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.align_item_center,
    ...paddingStyle.padding_horizontal_12,
  },
  body: {
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_center,
    ...layoutStyle.flex_1,
    ...borderStyle.border_top_width_hairline,
    ...borderStyle.border_bottom_width_hairline,
    ...borderStyle.border_color_7,
  },
  photo: {
    ...layoutStyle.height_100_percent,
    ...layoutStyle.width_100_percent,
  },
  preview: {
    ...layoutStyle.height_100_percent,
    ...layoutStyle.width_100_percent,
    ...layoutStyle.position_absolute,
  },
});
