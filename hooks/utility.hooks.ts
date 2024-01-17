import { useCallback, useEffect, useRef, useState } from "react";
import { ThunkState } from "../types/store.types";
import * as FileSystem from "expo-file-system";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { nanoid } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { selectPostScreenInfo } from "../store/post-screen/post_screen.selector";
import {
  cleanPostScreen,
  initPostScreen,
} from "../store/post-screen/post_screen.slice";
import { getPostScreenThunk } from "../store/post-screen/post_screen.thunk";
import { selectLocationScreenInfo } from "../store/location-screen/location_screen.selector";
import {
  cleanLocationScreen,
  initLocationScreen,
} from "../store/location-screen/location_screen.slice";
import { getLocationScreenThunk } from "../store/location-screen/location_screen.thunk";

export function useDeviceLayout() {
  const { width, height } = useWindowDimensions();

  const insets = useSafeAreaInsets();

  return {
    width,
    height,
    insets,
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

export function usePostScreen(url: string, initPosts: string[]) {
  const screenId = useRef(nanoid()).current;

  const screenInfo = useAppSelector((state) =>
    selectPostScreenInfo(state, screenId)
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initPostScreen({ screenId, initPosts }));
  }, [initPostScreen]);

  useEffect(() => {
    return () => {
      dispatch(cleanPostScreen({ screenId }));
    };
  }, []);

  const fetch = useCallback(() => {
    dispatch(getPostScreenThunk({ url, screenId }));
  }, [url]);

  return {
    screenInfo,
    fetch,
  };
}

export function useLocationScreen(locationId: string) {
  const screenId = useRef(nanoid()).current;

  const screenInfo = useAppSelector((state) =>
    selectLocationScreenInfo(state, screenId)
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initLocationScreen({ screenId }));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(cleanLocationScreen({ screenId }));
    };
  }, []);

  const fetch = useCallback(() => {
    dispatch(getLocationScreenThunk({ screenId, locationId }));
  }, [locationId]);

  return {
    screenInfo,
    fetch,
  };
}
