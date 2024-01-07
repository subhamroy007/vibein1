import { useCallback, useEffect, useState } from "react";
import { ThunkState } from "../types/store.types";
import * as FileSystem from "expo-file-system";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
