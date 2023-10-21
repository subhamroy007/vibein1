import { StyleSheet, View, useWindowDimensions } from "react-native";
import { PostPhotoParams } from "../../types/utility.types";
import { ThunkState } from "../../types/store.types";
import { useCallback, useState } from "react";
import {
  COLOR_2,
  COLOR_7,
  PHOTO_MAX_BLUR_RADIUS,
  SIZE_24,
  SIZE_90,
} from "../../constants";
import { backgroundStyle, layoutStyle } from "../../styles";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BaseButton } from "react-native-gesture-handler";
import RoundIcon from "../RoundIcon";

type AlbumphotoProps = {
  containerAspectRatio: string;
  type?: "light" | "dark";
} & PostPhotoParams;

export function AlbumPhoto({
  containerAspectRatio,
  url,
  previewUrl,
  type,
}: AlbumphotoProps) {
  const { width: screenWidth } = useWindowDimensions();

  const [loadingState, setLoadingState] = useState<ThunkState>("loading");

  const [previewLoadingState, setPreviewLoadingState] =
    useState<ThunkState>("loading");

  const [previewBlurRadius, setPreviewBlurRadius] = useState(
    PHOTO_MAX_BLUR_RADIUS
  );

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
    <View
      style={[
        {
          width: screenWidth,
        },
        type === "dark"
          ? backgroundStyle.background_color_4
          : backgroundStyle.background_color_1,
        styles.root_container,
      ]}
    >
      {loadingState !== "failed" && (
        <Image
          style={[
            styles.original_image,
            { opacity: loadingState === "success" ? 1 : 0 },
          ]}
          source={url}
          contentFit={containerAspectRatio === "9/16" ? "cover" : "contain"}
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
      {previewLoadingState !== "failed" && loadingState === "loading" && (
        <Image
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: previewLoadingState === "success" ? 1 : 0,
            },
          ]}
          source={previewUrl}
          contentFit={containerAspectRatio === "9/16" ? "cover" : "contain"}
          onLoadStart={previewLoadStartCallback}
          onError={previewLoadErrorCallback}
          onLoad={previewLoadCallback}
          blurRadius={previewBlurRadius}
        />
      )}
      {loadingState === "loading" && <View style={[styles.loadingIndicator]} />}
      {loadingState === "failed" && (
        <BaseButton
          rippleRadius={null}
          hitSlop={SIZE_24}
          style={layoutStyle.position_absolute}
          onPress={retryCallback}
        >
          <RoundIcon name="retry" iconColor={COLOR_2} />
        </BaseButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingIndicator: {
    width: SIZE_90,
    height: SIZE_90,
    borderRadius: SIZE_90 * 0.5,
    borderWidth: 4 * StyleSheet.hairlineWidth,
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
