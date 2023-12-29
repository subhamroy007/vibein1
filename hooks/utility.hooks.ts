import { useCallback, useEffect, useRef, useState } from "react";
import { ThunkState } from "../types/store.types";
import * as FileSystem from "expo-file-system";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { getImageFileUrl } from "../store/client/client.selector";
import { nanoid } from "@reduxjs/toolkit";
import { setImageFileUrl } from "../store/client/client.slice";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function usePhotoFetch(autoRetry?: boolean) {
  const [photoLoadingState, setPhotoLoadingState] =
    useState<ThunkState>("idle");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (photoLoadingState === "failed" && autoRetry) {
      timeoutRef.current = setTimeout(() => setPhotoLoadingState("idle"), 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [photoLoadingState, autoRetry]);

  const photoLoadCallback = useCallback(
    () => setPhotoLoadingState("success"),
    []
  );

  const photoLoadErrorCallback = useCallback(
    () => setPhotoLoadingState("failed"),
    []
  );

  const photoLoadStartCallback = useCallback(
    () => setPhotoLoadingState("loading"),
    []
  );

  return {
    photoLoadCallback,
    photoLoadErrorCallback,
    photoLoadStartCallback,
    photoLoadingState,
  };
}

export function useImageCache(url: string, autoRetry: boolean) {
  const fileUrl = useAppSelector((state) => getImageFileUrl(state, url));

  const [downloadState, setDownloadState] = useState<ThunkState>(
    fileUrl ? "success" : "idle"
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useAppDispatch();

  const fileDownloadCallback = useCallback(async () => {
    const newFileUrl =
      FileSystem.cacheDirectory +
      "image" +
      "_" +
      nanoid() +
      "_" +
      Date.now() +
      ".jpg";

    try {
      setDownloadState("loading");
      const dowloadResult = await FileSystem.downloadAsync(url, newFileUrl, {});
      if (dowloadResult.status > 210) {
        throw new Error("something went wrong");
      }
      setDownloadState("success");

      dispatch(setImageFileUrl({ url, fileUrl: newFileUrl }));
    } catch (error) {
      setDownloadState("failed");
      if (autoRetry) {
        setTimeout(fileDownloadCallback, 2000);
      }
    }
  }, [url, autoRetry]);

  useEffect(() => {
    if (!fileUrl) {
      fileDownloadCallback();
    }
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [fileDownloadCallback, fileUrl]);

  return { downloadState, fileUrl };
}

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
