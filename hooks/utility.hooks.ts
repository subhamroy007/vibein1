import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThunkState } from "../types/store.types";
import * as FileSystem from "expo-file-system";
import {
  PermissionsAndroid,
  PixelRatio,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { nanoid } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import {
  usePermissions,
  getAlbumsAsync,
  getAssetsAsync,
  Asset,
} from "expo-media-library";
import { useFocusEffect } from "expo-router";
import { selectDarkScreenFocused } from "../store/client/client.selector";
import { RootState } from "../store";
import { changeDarkScreenFocused } from "../store/client/client.slice";
import { COLOR_1, COLOR_4, LINE_WIDTH, SIZE_27, SIZE_36 } from "../constants";

import { layoutStyle } from "../styles";
import Animated, {
  Extrapolate,
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { SwipeUpPortalRefParams } from "../components/portals/SwipeUpPortal";

export function useDeviceLayout() {
  const insets = useSafeAreaInsets();

  const frame = useSafeAreaFrame();

  return {
    insets,
    width: frame.width,
    height: frame.height,
    cappedHeight: frame.height - insets.top - insets.bottom,
  };
}

export function useDownloadImage(url: string, retry: boolean = true) {
  const [state, setState] = useState<ThunkState>("idle");
  const [urlValue, setUrlValue] = useState<string | null>(null);

  const downloadImage = useCallback(
    async (url: string, localeUrl: string, retry: boolean) => {
      setState("loading");
      try {
        // Download the image to the cache directory
        await FileSystem.downloadAsync(url, localeUrl);
        setState("success");
        setUrlValue(localeUrl);
      } catch (error) {
        if (retry) {
          // Retry after 2 seconds if download fails
          setTimeout(() => {
            downloadImage(url, localeUrl, retry);
          }, 2000);
        } else {
          // Don't retry, set state to failed
          setState("failed");
        }
      }
    },
    []
  );

  useEffect(() => {
    // Extract the image name from the URL
    const imageName = url.split("/").pop();
    if (!imageName || !FileSystem.cacheDirectory) {
      console.error("Error checking for cached directory");
      setState("failed");
    } else {
      const localeFileUrl = FileSystem.cacheDirectory + imageName;
      // Check if the image exists in the cache
      FileSystem.getInfoAsync(localeFileUrl)
        .then((info) => {
          if (info.exists) {
            // Image is in cache, return the local URL
            setState("success");
            setUrlValue(localeFileUrl);
          } else {
            // Image not in cache, download it
            downloadImage(url, localeFileUrl, retry);
          }
        })
        .catch((error) => {
          console.error("Error checking for cached image:", error);
          setState("failed");
        });
    }
  }, [url, retry]);

  return { state, urlValue };
}

const checkReadPermission = () => {
  if (Platform.OS !== "android") return Promise.resolve(true);
  if (Platform.Version >= 33) {
    return Promise.all([
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      ),
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
    ]).then(
      ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
        hasReadMediaImagesPermission && hasReadMediaVideoPermission
    );
  } else {
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
  }
};

const requestReadPermission = () => {
  if (Platform.OS !== "android") return Promise.resolve(true);
  if (Platform.Version >= 33) {
    return PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]).then(
      (statuses) =>
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
          PermissionsAndroid.RESULTS.GRANTED
    );
  } else {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    ).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
  }
};

const hasReadPermission = async () => {
  if (Platform.OS !== "android") {
    return true;
  }

  const hasPermission = await checkReadPermission();

  if (hasPermission) {
    return true;
  }

  return !(await requestReadPermission());
};

export type AlbumParams = {
  id: string;
  title: string;
  noOfFiles: number;
  hasNextPage: boolean;
  endCursor: string;
  files: FileParams[];
};

export type FileParams = {
  id: string;
  uri: string;
  creationTime: number;
  filename: string;
  modificationTime: number;
  width: number;
  height: number;
  albumId?: string;
  duration: number;
  type: "photo" | "video";
};

export type AlbumSelectorParams = {
  firstFile: {
    type: "photo" | "video";
    width: number;
    height: number;
    uri: string;
    filename: string;
  };
  id: string;
  title: string;
  noOfFiles: number;
};

const convertAssetToFileParams = (asset: Asset): FileParams => {
  return {
    id: asset.id,
    albumId: asset.albumId,
    creationTime: asset.creationTime,
    duration: asset.duration,
    filename: asset.filename,
    height: asset.height,
    modificationTime: asset.modificationTime,
    type: asset.mediaType === "photo" ? "photo" : "video",
    uri: asset.uri,
    width: asset.width,
  };
};

export function useDeviceGallery() {
  const [permission] = usePermissions({ get: true, request: true });

  const [albums, setAlbums] = useState<AlbumParams[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<FileParams[]>([]);

  const [selectedAlbumId, setSelectedAlbumId] = useState("root");

  const [isPageLoading, setPageLoading] = useState(false);

  const fileSelectCallback = useCallback((selectedFile: FileParams) => {
    setSelectedFiles((prevState) => {
      if (prevState.find((file) => file.id === selectedFile.id)) {
        return prevState.filter((file) => file.id !== selectedFile.id);
      }
      if (prevState.length === 10) {
        return prevState;
      }
      return [...prevState, selectedFile];
    });
  }, []);

  const fetchFiles = useCallback(
    async (after?: string, targetAlbumId?: string) => {
      setPageLoading(true);

      const assetPage = await getAssetsAsync({
        after,
        album: targetAlbumId === "root" ? undefined : targetAlbumId,
        first: 100,
        mediaType: ["photo", "video"],
        sortBy: ["modificationTime", "creationTime"],
      });

      setAlbums((prevState) => {
        return prevState.map((album) => {
          if (
            (!targetAlbumId && album.id === "root") ||
            album.id === targetAlbumId
          ) {
            return {
              ...album,
              endCursor: assetPage.endCursor,
              files: [
                ...album.files,
                ...assetPage.assets.map((asset) =>
                  convertAssetToFileParams(asset)
                ),
              ],
              hasNextPage: assetPage.hasNextPage,
              noOfFiles: assetPage.totalCount,
            };
          }
          return album;
        });
      });
      setPageLoading(false);
    },
    []
  );

  const selectedAlbum = useMemo(() => {
    return albums.find((album) => album.id === selectedAlbumId);
  }, [albums, selectedAlbumId]);

  const albumsBasicInfo = useMemo(() => {
    return albums.map<AlbumSelectorParams>((album) => {
      return {
        id: album.id,
        title: album.title,
        noOfFiles: album.noOfFiles,
        firstFile: {
          type: album.files[0].type,
          width: album.files[0].width,
          height: album.files[0].height,
          uri: album.files[0].uri,
          filename: album.files[0].filename,
        },
      };
    });
  }, [albums]);

  const initState = useCallback(async () => {
    const filteredAlbums: AlbumParams[] = [];
    const rootFolderAssets = await getAssetsAsync({
      mediaType: ["photo", "video"],
      sortBy: ["modificationTime", "creationTime"],
      first: 100,
    });

    filteredAlbums.push({
      id: "root",
      title: "All",
      endCursor: rootFolderAssets.endCursor,
      hasNextPage: rootFolderAssets.hasNextPage,
      noOfFiles: rootFolderAssets.totalCount,
      files: rootFolderAssets.assets.map((asset) =>
        convertAssetToFileParams(asset)
      ),
    });

    const allAlbums = await getAlbumsAsync();

    const allAlbumsPageInfo = await Promise.all(
      allAlbums.map((album) => {
        return getAssetsAsync({
          album: album.id,
          mediaType: ["photo", "video"],
        });
      })
    );

    allAlbums.forEach((album, index) => {
      const fileCount = allAlbumsPageInfo[index].totalCount;
      const hasNextPage = allAlbumsPageInfo[index].hasNextPage;
      const endCursor = allAlbumsPageInfo[index].endCursor;
      const assets = allAlbumsPageInfo[index].assets;
      if (fileCount > 0) {
        filteredAlbums.push({
          id: album.id,
          title: album.title,
          noOfFiles: fileCount,
          hasNextPage,
          endCursor,
          files: assets.map((asset) => convertAssetToFileParams(asset)),
        });
      }
    });

    setAlbums(filteredAlbums);
  }, []);

  useEffect(() => {
    if (permission?.granted) {
      initState();
    }
  }, [permission]);

  return {
    albumsBasicInfo,
    selectedAlbum,
    selectedFiles,
    setSelectedAlbumId,
    fetchFiles,
    fileSelectCallback,
    isPageLoading,
  };
}

export function useIsFocused() {
  const [isRouteFocused, setIsRouteFocused] = useState(false);

  const routeFocusCallback = useCallback(() => {
    setIsRouteFocused(true);
    return () => {
      setIsRouteFocused(false);
    };
  }, []);

  useFocusEffect(routeFocusCallback);

  return isRouteFocused;
}

export function useDarkScreenFocused() {
  const dispatch = useAppDispatch();

  const selector = useCallback(
    (state: RootState) => selectDarkScreenFocused(state),
    []
  );

  const isDarkScreenFocused = useAppSelector(selector);

  return isDarkScreenFocused;
}

export function useScreenInit(dark?: boolean) {
  const dispatch = useAppDispatch();

  const screenFocusCallback = useCallback(() => {
    if (dark) {
      dispatch(changeDarkScreenFocused(true));
    } else {
      dispatch(changeDarkScreenFocused(false));
    }
  }, [dark]);

  useFocusEffect(screenFocusCallback);
}

export function useIcon(color?: string, size?: number) {
  const calculatedColor = color ? color : COLOR_4;

  const calculatedSize = size ? size : SIZE_27;

  return { calculatedColor, calculatedSize };
}

export function useIconCircle(
  size?: number,
  color?: string,
  scale?: number,
  backgroundColor?: string,
  keepOutlineWithBackground?: boolean,
  outlineColor?: string,
  outlineWidth?: number
) {
  const calculatedCircleSize = size ? size : SIZE_36;

  const calculatedScale = scale ? scale : 0.6;

  const calculatedIconSize = calculatedCircleSize * calculatedScale;

  const calculatedIconColor = color
    ? color
    : backgroundColor
    ? COLOR_1
    : COLOR_4;

  const calculatedOutlineColor = outlineColor
    ? outlineColor
    : calculatedIconColor;

  const calculatedOutlineWidth =
    backgroundColor && !keepOutlineWithBackground
      ? 0
      : outlineWidth
      ? outlineWidth * LINE_WIDTH
      : LINE_WIDTH;

  const circle_style: StyleProp<ViewStyle> = [
    layoutStyle.content_center,
    {
      width: calculatedCircleSize,
      height: calculatedCircleSize,
      borderRadius: calculatedCircleSize,
      backgroundColor,
      borderWidth: calculatedOutlineWidth,
      borderColor: calculatedOutlineColor,
    },
  ];

  return { circle_style, calculatedIconColor, calculatedIconSize };
}

export function usePressAnimation(
  animateOnPress?: boolean,
  animateOnLongPress?: boolean,
  onPress?:
    | ((event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => void)
    | undefined,
  onLongPress?:
    | ((event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => void)
    | undefined
): [
  StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>,
  (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => void,
  (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => void
] {
  const scale = useSharedValue(1);

  const startAnimation = useCallback(() => {
    scale.value = 1;
    scale.value = withSequence(
      withTiming(0.8, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  }, []);

  const longPressCallback = useCallback(
    (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
      if (onLongPress) {
        if (animateOnLongPress) {
          startAnimation();
        }
        onLongPress(event);
      }
    },
    [onLongPress, animateOnLongPress]
  );

  const pressCallback = useCallback(
    (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
      if (onPress) {
        if (animateOnPress) {
          startAnimation();
        }
        onPress(event);
      }
    },
    [onPress, animateOnPress]
  );

  return [animatedStyle, pressCallback, longPressCallback];
}

export function useDataFetchHook(
  data?: any[] | null | undefined,
  isLoading?: boolean,
  isPageLoading?: boolean,
  onEndReach?: () => void,
  onInit?: () => void
) {
  const [refreshing, setRefreshing] = useState(false);

  const endReachedCallback = useCallback(() => {
    if (!isLoading && !isPageLoading && data && data.length > 0 && onEndReach) {
      onEndReach();
    }
  }, [isLoading, data, onEndReach]);

  const refreshCallback = useCallback(() => {
    if (onInit && !isLoading && !isPageLoading) {
      setRefreshing(true);
      onInit();
    }
  }, [onInit, isLoading]);

  useEffect(() => {
    if (!isLoading && refreshing) {
      setRefreshing(false);
    }
  }, [isLoading, refreshing]);

  return {
    refreshing,
    endReachedCallback,
    refreshCallback,
  };
}

export function useAutoFetch(
  fetch: () => void,
  data: null | undefined | any,
  focused: boolean = true
) {
  const isRouteFocused = useIsFocused();

  useEffect(() => {
    if (focused && isRouteFocused && data === null) {
      fetch();
    }
  }, [focused, isRouteFocused, fetch, data]);
}

export function usePortalAnimatedGesture(height: number) {
  const portalRef = useRef<SwipeUpPortalRefParams>();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollOffset = useSharedValue(height);
  const portalPosition = useSharedValue(height);
  const dragging = useSharedValue(false);
  const scrollPositionReseting = useSharedValue(false);
  const portalReleasing = useSharedValue(false);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, height],
            [-height, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  }, [height]);
  const someValue = PixelRatio.roundToNearestPixel(height * 0.7);

  useDerivedValue(() => {
    if (scrollOffset.value < height) {
      if (dragging.value) {
        portalRef.current?.move(
          interpolate(
            scrollOffset.value,
            [0, height],
            [someValue, 0],
            Extrapolate.CLAMP
          )
        );
      } else {
        if (portalPosition.value > 0) {
          if (!portalReleasing.value) {
            portalReleasing.value = true;
            console.log("portal rleasing");
            scrollTo(scrollRef, 0, height, false);
            portalRef.current?.release(0);
          }
          // scrollTo(
          //   scrollRef,
          //   0,
          //   Math.round(
          //     interpolate(
          //       portalPosition.value,
          //       [0, someValue],
          //       [height, 0],
          //       Extrapolate.CLAMP
          //     )
          //   ),
          //   false
          // );
        } else {
          if (!scrollPositionReseting.value) {
            console.log("reseting scroll position ");
            scrollPositionReseting.value = true;
            scrollTo(scrollRef, 0, height, false);
            console.log("scroll position reset ");
            scrollPositionReseting.value = false;
          }
        }
      }
    }
    if (portalPosition.value === 0 && portalReleasing.value) {
      console.log("portal released");
      portalReleasing.value = false;
    }
  }, [height, someValue]);

  // useDerivedValue(() => {
  //   if (
  //     !dragging.value &&
  //     scrollOffset.value < height &&
  //     // portalPosition.value === 0 &&
  //     !scrollPositionReseting.value
  //   ) {
  //     console.log("reseting scroll position ");
  //     scrollPositionReseting.value = true;
  //     scrollTo(scrollRef, 0, height, false);
  //     console.log("scroll position reset ");
  //     scrollPositionReseting.value = false;
  //   }
  // }, [height]);

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll(event) {
        scrollOffset.value = event.contentOffset.y;
      },
      onBeginDrag() {
        dragging.value = true;
      },
      onEndDrag() {
        dragging.value = false;
      },
    },
    [height]
  );

  return {
    containerAnimatedStyle,
    portalRef,
    scrollRef,
    onScroll,
    portalPosition,
  };
}
