import { ResizeMode, Video } from "expo-av";
import { PostMomentVideoParams } from "../types/utility.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { layoutStyle } from "../styles";
import RetryableImage from "./RetryableImage";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";

export type RetryableVideoProps = {
  focused: boolean;
  video: PostMomentVideoParams;
  muted?: boolean;
  paused?: boolean;
};

const RetryableVideo = ({
  focused,
  video,
  muted,
  paused,
}: RetryableVideoProps) => {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<Video | null>(null);

  const [screeFocused, setScreenFocused] = useState(false);

  const screenFocusCallback = useCallback(() => {
    setScreenFocused(true);

    return () => {
      setScreenFocused(false);
    };
  }, []);

  useFocusEffect(screenFocusCallback);

  const loadVideo = useCallback(async (url: string) => {
    if (videoRef.current) {
      try {
        await videoRef.current.loadAsync(
          { uri: url },
          {
            isLooping: true,
            shouldPlay: true,
            progressUpdateIntervalMillis: 150,
            positionMillis: 0,
          }
        );
        videoRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            //   setVideoPaused(!status.isPlaying);
            //   setCurrentPosition(status.positionMillis);
          }
        });
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          loadVideo(url);
        }, 2000);
      }
    }
  }, []);

  const unloadVideo = useCallback(() => {
    setVideoReady(false);
    videoRef.current = null;
  }, []);

  useEffect(() => {
    if (focused && screeFocused) {
      loadVideo(video.url);
    }

    return () => {
      if (focused && screeFocused) {
        unloadVideo();
      }
    };
  }, [focused, video, screeFocused]);

  useEffect(() => {
    if (videoRef.current && muted !== undefined) {
      videoRef.current.setIsMutedAsync(muted ? muted : false);
    }
  }, [muted]);

  useEffect(() => {
    if (videoRef.current && paused !== undefined) {
      if (paused) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
    }
  }, [paused]);

  return (
    <>
      {focused && screeFocused && (
        <Video
          ref={(ref) => {
            videoRef.current = ref;
          }}
          style={[
            layoutStyle.width_100_percent,
            layoutStyle.height_100_percent,
          ]}
          resizeMode={ResizeMode.COVER}
          onReadyForDisplay={() => {
            setVideoReady(true);
          }}
        />
      )}
      {!videoReady && (
        <RetryableImage
          source={video.thumbnail.url}
          style={StyleSheet.absoluteFill}
        />
      )}
    </>
  );
};

export default RetryableVideo;
