import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Image, ImageStyle, StyleSheet, View, ViewProps } from "react-native";
import { Blurhash } from "react-native-blurhash";
import { backgroundStyle, borderStyle, layoutStyle } from "../styles";
import { COLOR_1, COLOR_4, SIZE_120 } from "../constants";
import * as FileSystem from "expo-file-system";
import { useNetInfo } from "@react-native-community/netinfo";
import { useIsFocused } from "../hooks/utility.hooks";
import { shallowEqual } from "react-redux";

const fileExists = async (uri: string) => {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  return fileInfo.exists;
};

const transformToLocalUri = (uri: string) => {
  if (
    uri.startsWith(FileSystem.cacheDirectory!) ||
    uri.startsWith(FileSystem.documentDirectory!)
  ) {
    return uri;
  }

  const imageName = uri.split("/").pop();

  if (imageName) {
    return FileSystem.cacheDirectory + imageName;
  }

  return null;
};

type PhotoProps = {
  uri: string;
  autoRetry?: boolean;
  placeholder?: string;
  showLoadingRing?: boolean;
  background?: "light" | "dark" | "transparent";
  contained?: boolean;
} & ViewProps;

const Photo = ({
  uri,
  autoRetry,
  background,
  placeholder,
  showLoadingRing,
  style,
  children,
  contained,
  ...restProps
}: PhotoProps) => {
  const { isInternetReachable } = useNetInfo();

  const isRouteFocused = useIsFocused();

  const timemoutRef = useRef<NodeJS.Timeout>();

  const [downloadedUri, setDownloadedUri] = useState<string | null>(null);

  const [error, setError] = useState<any | null>(null);

  const downloadImage = useCallback(async (uri: string, localUri: string) => {
    try {
      setError(null);
      await FileSystem.downloadAsync(uri, localUri);
      // console.log("photo downloaded, seting to render");
      setDownloadedUri(localUri);
    } catch (error) {
      // console.log("failed to download photo ", error);
      setError(error);
    }
  }, []);

  const resetUri = useCallback(async (uri: string) => {
    // console.log("mapping photo network uri to local uri");
    const localUri = transformToLocalUri(uri);
    if (localUri) {
      // console.log("local photo uri is ", localUri);
      // console.log("checking if the photo exisits in the cache");
      if (await fileExists(localUri)) {
        // console.log("photo already exists in the cache, seting to render");
        setDownloadedUri(localUri);
      } else {
        // console.log("photo does not exist in the cache, starting to download");
        downloadImage(uri, localUri);
      }
    }
  }, []);

  useEffect(() => {
    resetUri(uri);

    return () => {
      setDownloadedUri(null);
      setError(null);
    };
  }, [uri]);

  useEffect(() => {
    if (autoRetry !== false && error && isInternetReachable && isRouteFocused) {
      // console.log("will retry to download photo after 2 seconds");
      timemoutRef.current = setTimeout(
        () => downloadImage(uri, transformToLocalUri(uri)!),
        2000
      );
    }

    return () => {
      clearTimeout(timemoutRef.current);
    };
  }, [uri, autoRetry, error, isInternetReachable, isRouteFocused]);

  const calculatedBackgroundColor =
    !background || background === "transparent"
      ? undefined
      : background === "light"
      ? COLOR_1
      : COLOR_4;

  if (downloadedUri) {
    return (
      <Image
        source={{ uri: downloadedUri! }}
        style={[
          {
            backgroundColor: calculatedBackgroundColor,
          },
          style ? (style as ImageStyle) : layoutStyle.fill,
        ]}
        resizeMode={contained ? "contain" : "cover"}
        {...restProps}
      />
    );
  }

  return (
    <View
      style={[
        { backgroundColor: calculatedBackgroundColor },
        style ? style : layoutStyle.fill,
        layoutStyle.content_center,
      ]}
      {...restProps}
    >
      {placeholder ? (
        <Blurhash
          blurhash={placeholder}
          resizeMode={contained ? "contain" : "cover"}
          style={StyleSheet.absoluteFill}
        />
      ) : undefined}
      {showLoadingRing && (
        <View
          style={[
            styles.loadingRing,
            borderStyle.border_color_2,
            borderStyle.border_width_1,
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingRing: {
    width: "25%",
    aspectRatio: "1/1",
    borderRadius: SIZE_120,
  },
});

export default memo<PhotoProps>(
  Photo,
  ({ children: children1, ...prop1 }, { children: children2, ...prop2 }) => {
    return shallowEqual(prop1, prop2);
  }
);
