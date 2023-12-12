import { useCallback, useEffect, useRef, useState } from "react";
import { ThunkState } from "../types/store.types";
import * as FileSystem from "expo-file-system";
import { useAppDispatch, useAppSelector } from "./storeHooks";
import { getImageFileUrl } from "../store/client/client.selector";
import { nanoid } from "@reduxjs/toolkit";
import { setImageFileUrl } from "../store/client/client.slice";

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

  const [downloadState, setDownloadState] = useState<ThunkState>("idle");

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
