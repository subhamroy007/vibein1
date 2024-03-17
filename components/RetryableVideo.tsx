import { AVPlaybackStatus, ResizeMode, Video, VideoProps } from "expo-av";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import { layoutStyle } from "../styles";
import RetryableImage from "./RetryableImage";
import { StyleProp, View, ViewStyle } from "react-native";
import { useFocusEffect } from "expo-router";

export type RetryableVideoRefParams = {
  seek: (position: number) => void;
};

export type RetryableVideoProps = {
  focused: boolean;
  url: string;
  poster: string;
  muted?: boolean;
  paused?: boolean;
  style?: StyleProp<ViewStyle>;
  resizeMode?: VideoProps["resizeMode"];
  onReadyForDisplay?: VideoProps["onReadyForDisplay"];
  onPlaybackStatusUpdate?: VideoProps["onPlaybackStatusUpdate"];
};

const RetryableVideo = forwardRef<RetryableVideoRefParams, RetryableVideoProps>(
  (
    {
      focused,
      poster,
      url,
      muted,
      paused,
      style,
      onPlaybackStatusUpdate,
      onReadyForDisplay,
      resizeMode,
    },
    reference
  ) => {
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

    useImperativeHandle(
      reference,
      () => {
        return {
          seek(position) {
            videoRef.current?.setPositionAsync(position);
          },
        };
      },
      []
    );

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
        loadVideo(url);
      }

      return () => {
        if (focused && screeFocused) {
          unloadVideo();
        }
      };
    }, [focused, url, screeFocused]);

    return (
      <>
        {focused && screeFocused && (
          <Video
            ref={videoRef}
            style={style}
            resizeMode={resizeMode ? resizeMode : ResizeMode.COVER}
            onReadyForDisplay={(event) => {
              setVideoReady(true);
              if (onReadyForDisplay) {
                onReadyForDisplay(event);
              }
            }}
            isMuted={muted}
            shouldPlay={!paused}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          >
            <View
              style={{ width: "100%", height: "100%", backgroundColor: "red" }}
            />
          </Video>
        )}
        <View style={style}>
          {!videoReady && (
            <RetryableImage
              source={poster}
              style={[layoutStyle.flex_1, { opacity: 0 }]}
              resizeMode={
                resizeMode
                  ? resizeMode === ResizeMode.COVER
                    ? "cover"
                    : "contain"
                  : "cover"
              }
            />
          )}
        </View>
      </>
    );
  }
);

export default RetryableVideo;
