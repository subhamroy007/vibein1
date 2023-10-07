import { useCallback, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import {
  BaseButton,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import {
  COLOR_2,
  COLOR_8,
  PHOTO_MAX_BLUR_RADIUS,
  SIZE_24,
  SIZE_4,
  SIZE_18,
  SIZE_90,
  COLOR_7,
} from "../constants";
import { backgroundStyle, borderStyle, layoutStyle } from "../styles";
import { Image } from "expo-image";
import { FetchState, PostPhotoParams } from "../types";
import RoundIcon from "./RoundIcon";

function findAspectRatio(photos: PostPhotoParams[]) {
  let aspectRatio = photos[0].aspectRatio;
  let ratio = photos[0].width / photos[0].height;
  photos.forEach((photo) => {
    const currentphotoRatio = photo.width / photo.height;
    if (currentphotoRatio < ratio) {
      ratio = currentphotoRatio;
      aspectRatio = photo.aspectRatio;
    }
  });
  return aspectRatio;
}

export type AlbumProps = {
  photos: PostPhotoParams[];
  onDoubleTap: () => void;
};

type AlbumphotoProps = {
  containerAspectRatio: string;
  onDoubleTap: () => void;
} & PostPhotoParams;

export function Albumphoto({
  containerAspectRatio,
  url,
  previewUrl,
  aspectRatio,
  onDoubleTap,
}: AlbumphotoProps) {
  const { width: screenWidth } = useWindowDimensions();

  const [loadingState, setLoadingState] = useState<FetchState>("loading");

  const [previewLoadingState, setPreviewLoadingState] =
    useState<FetchState>("loading");

  const [previewBlurRadius, setPreviewBlurRadius] = useState(
    PHOTO_MAX_BLUR_RADIUS
  );

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(onDoubleTap)
    .enabled(loadingState === "success");

  const retryCallback = useCallback(() => {
    setLoadingState("loading");
    setPreviewLoadingState((prevState) => {
      if (prevState === "failed") {
        return "loading";
      }
      return prevState;
    });
  }, [setLoadingState, setPreviewLoadingState]);

  const imageLoadStartCallback = useCallback(() => {
    setLoadingState("loading");
  }, [setLoadingState]);

  const imageLoadErrorCallback = useCallback(() => {
    setLoadingState("failed");
  }, [setLoadingState]);

  const imageLoadCallback = useCallback(() => {
    setLoadingState("success");
  }, [setLoadingState]);

  const previewLoadStartCallback = useCallback(() => {
    setPreviewLoadingState("loading");
  }, [setPreviewLoadingState]);

  const previewLoadErrorCallback = useCallback(() => {
    setPreviewLoadingState("failed");
  }, [setPreviewLoadingState]);

  const previewLoadCallback = useCallback(() => {
    setPreviewLoadingState("success");
  }, [setPreviewLoadingState]);

  return (
    <GestureDetector gesture={doubleTapGesture}>
      <Animated.View
        style={[
          {
            aspectRatio:
              containerAspectRatio === "9/16" ? "3/4" : containerAspectRatio,
            width: screenWidth,
          },
          layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
          borderStyle.border_color_2,
          borderStyle.border_bottom_width_hairline,
          borderStyle.border_top_width_hairline,
        ]}
      >
        {loadingState !== "failed" && (
          <Image
            style={[
              layoutStyle.width_100_percent,
              layoutStyle.height_100_percent,
              backgroundStyle.background_color_1,
              { opacity: loadingState === "success" ? 1 : 0 },
            ]}
            source={url}
            contentFit={
              aspectRatio === containerAspectRatio || aspectRatio === "9/16"
                ? "cover"
                : "contain"
            }
            onLoadStart={imageLoadStartCallback}
            onError={imageLoadErrorCallback}
            onLoad={imageLoadCallback}
            onProgress={({ loaded, total }) => {
              const progress = Math.floor(
                Math.round(12 - (loaded * 12) / total) / 4
              );

              setPreviewBlurRadius(Math.max(progress * 4, 4));
            }}
          />
        )}
        {previewLoadingState !== "failed" && loadingState !== "success" && (
          <Image
            style={[
              backgroundStyle.background_color_1,
              layoutStyle.position_absolute,
              layoutStyle.width_100_percent,
              layoutStyle.height_100_percent,
              {
                opacity: previewLoadingState === "success" ? 1 : 0,
              },
            ]}
            source={previewUrl}
            contentFit={
              aspectRatio === containerAspectRatio || aspectRatio === "9/16"
                ? "cover"
                : "contain"
            }
            onLoadStart={previewLoadStartCallback}
            onError={previewLoadErrorCallback}
            onLoad={previewLoadCallback}
            blurRadius={previewBlurRadius}
          />
        )}
        {loadingState === "loading" && (
          <View
            style={[
              layoutStyle.position_absolute,
              styles.loadingIndicator,
              { borderColor: COLOR_7 },
            ]}
          />
        )}
        {loadingState === "failed" && (
          <BaseButton
            rippleRadius={null}
            rippleColor={COLOR_8}
            hitSlop={SIZE_24}
            style={layoutStyle.position_absolute}
            onPress={retryCallback}
          >
            <RoundIcon name="retry" iconColor={COLOR_2} />
          </BaseButton>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

export default function Album({ photos, onDoubleTap }: AlbumProps) {
  const { width: screenWidth } = useWindowDimensions();

  const containerAspectRatio = findAspectRatio(photos);

  const [photoIndex, setphotoIndex] = useState(0);

  const onMomentumScrollEndCallback = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newPhotoIndex = Math.floor(
        Math.floor(contentOffset.x) / Math.floor(screenWidth)
      );
      setphotoIndex(newPhotoIndex);
    },
    [setphotoIndex]
  );

  if (photos.length === 1) {
    return (
      <Albumphoto
        containerAspectRatio={containerAspectRatio}
        onDoubleTap={onDoubleTap}
        {...photos[0]}
      />
    );
  }

  return (
    <>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        overScrollMode="never"
        onMomentumScrollEnd={onMomentumScrollEndCallback}
      >
        {photos.map((photo, index) => (
          <Albumphoto
            key={photo.url + index}
            containerAspectRatio={containerAspectRatio}
            onDoubleTap={onDoubleTap}
            {...photo}
          />
        ))}
      </ScrollView>
      <View
        style={[
          layoutStyle.position_absolute,
          layoutStyle.flex_direction_row,
          styles.carosol,
        ]}
      >
        {photos.map((photo, index) => (
          <View
            style={[
              styles.carosol_dot,
              index === photoIndex
                ? backgroundStyle.background_color_5
                : backgroundStyle.background_color_2,
            ]}
            key={photo.url + index}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  carosol: {
    bottom: SIZE_18,
  },
  carosol_dot: {
    width: SIZE_4,
    height: SIZE_4,
    borderRadius: SIZE_4 * 0.5,
    marginHorizontal: SIZE_4 * 0.5,
  },
  loadingIndicator: {
    width: SIZE_90,
    height: SIZE_90,
    borderRadius: SIZE_90 * 0.5,
    borderWidth: 4 * StyleSheet.hairlineWidth,
  },
});
