import { StyleSheet, View, useWindowDimensions } from "react-native";
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
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import AnimatedPressable from "../AnimatedPressable";

export type PostPreviewProps = {
  id: string;
  scrollOffset: SharedValue<number>;
  index: number;
  length: number;
  onDismiss: () => void;
};

export default function PostPreview({
  id,
  index,
  length,
  scrollOffset,
  onDismiss,
}: PostPreviewProps) {
  const { width: screenWidth } = useWindowDimensions();

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

  const animatedRootContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollOffset.value,
            [index * screenWidth, (length - 1) * screenWidth],
            [0, (length - 1 - index) * screenWidth],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const animatedContentContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollOffset.value,
            [index * screenWidth, (index + 1) * screenWidth],
            [1, 0.7],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  if (!postParams) {
    return null;
  }

  const { author, isLiked, originalUrl, previewUrl } = postParams;

  return (
    <AnimatedPressable
      style={[
        { width: screenWidth },
        styles.root_container,
        animatedRootContainerStyle,
        layoutStyle.flex_1,
      ]}
      onPress={onDismiss}
    >
      <Animated.View
        style={[styles.content_container, animatedContentContainerStyle]}
      >
        <View style={styles.header}>
          <Avatar url={author.profilePictureUri} size={SIZE_30} />
          <AppText style={marginStyle.margin_left_6} size={SIZE_12}>
            {author.userId}
          </AppText>
        </View>
        <View style={styles.body}>
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
        </View>
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
    </AnimatedPressable>
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
