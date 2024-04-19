import { useNetInfo } from "@react-native-community/netinfo";
import {
  Video as ExpoVideo,
  ResizeMode,
  VideoReadyForDisplayEvent,
} from "expo-av";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { StyleSheet, ViewProps } from "react-native";
import Photo from "./Photo";
import { useIsFocused } from "../hooks/utility.hooks";
import { COLOR_1, COLOR_4 } from "../constants";
import Animated from "react-native-reanimated";

type VideoProps = {
  uri: string;
  poster?: {
    uri: string;
    placeholder?: string;
  };
  background?: "light" | "dark" | "transparent";
  contained?: boolean;
  focused?: boolean;
  preload?: boolean;
  repeat?: boolean;
  autoPlayOnFocus?: boolean;
  muted?: boolean;
  paused?: boolean;
  onReady?: (duration: number) => void;
} & ViewProps;

type VideoRefParams = {
  play: () => void;
  pause: () => void;
  seek: (position: number) => void;
};

const Video = forwardRef<VideoRefParams, VideoProps>(
  (
    {
      uri,
      poster,
      background,
      contained,
      style,
      children,
      paused,
      focused,
      preload,
      repeat,
      autoPlayOnFocus,
      muted,
      onReady,
      ...restProps
    },
    ref
  ) => {
    const videoRef = useRef<ExpoVideo | null>(null);

    useImperativeHandle(ref, () => {
      return {
        pause() {
          videoRef.current?.pauseAsync();
        },
        play() {
          videoRef.current?.playAsync();
        },
        seek(position) {
          videoRef.current?.playFromPositionAsync(position);
        },
      };
    });

    const isRouteFocused = useIsFocused();

    const [isVideoReady, setVideoReady] = useState(false);

    const { isInternetReachable } = useNetInfo();

    const timemoutRef = useRef<NodeJS.Timeout>();

    const [error, setError] = useState<any | null>(null);

    const loadVideo = useCallback(async (uri: string) => {
      try {
        setError(null);
        await videoRef.current?.loadAsync({ uri }, { shouldPlay: false });
        console.log("video loaded");
      } catch (error) {
        console.error("failed to load video");
        console.error(error);
        setError(error);
      }
    }, []);

    const unloadVideo = useCallback(async () => {
      setError(null);
      setVideoReady(false);
      if (videoRef.current) {
        videoRef.current
          .unloadAsync()
          .then(() => {
            console.log("video unloaded");
          })
          .catch((reason) => {
            console.error("failed to unload video");
            console.error(reason);
          });
      }
    }, []);

    //used to preload the video if the route is focused and in case the uri changes and otherwise unload it
    useEffect(() => {
      if (preload && isRouteFocused) {
        loadVideo(uri);
      }

      return () => {
        unloadVideo();
      };
    }, [preload, uri, isRouteFocused]);

    //use to play or pause the video in case the focused or autoplay prop changes
    useEffect(() => {
      return () => {
        if (focused && isVideoReady && autoPlayOnFocus !== false) {
          videoRef.current?.stopAsync();
        }
      };
    }, [focused, isVideoReady, autoPlayOnFocus]);

    //use to repeatedly try to load the video if the route is focused and internet is reachable
    useEffect(() => {
      if (error && isInternetReachable && preload && isRouteFocused) {
        timemoutRef.current = setTimeout(() => loadVideo(uri), 2000);
      }

      return () => {
        clearTimeout(timemoutRef.current);
      };
    }, [uri, error, isInternetReachable, isRouteFocused]);

    const videoReadyCallback = useCallback(
      ({ status }: VideoReadyForDisplayEvent) => {
        setVideoReady(true);
        if (onReady && status && status.isLoaded && status.durationMillis) {
          onReady(status.durationMillis);
        }
      },
      [onReady]
    );

    const errorCallback = useCallback(
      (error: string) => {
        if (isVideoReady) {
          unloadVideo();
          setError(error);
        }
      },
      [isVideoReady]
    );

    const calculatedBackgroundColor =
      !background || background === "transparent"
        ? undefined
        : background === "light"
        ? COLOR_1
        : COLOR_4;
    return (
      <Animated.View
        style={[{ backgroundColor: calculatedBackgroundColor }, style]}
      >
        <ExpoVideo
          ref={videoRef}
          isMuted={muted}
          resizeMode={contained ? ResizeMode.CONTAIN : ResizeMode.COVER}
          {...restProps}
          onReadyForDisplay={videoReadyCallback}
          onError={errorCallback}
          style={StyleSheet.absoluteFill}
          isLooping={repeat}
          shouldPlay={
            !paused && autoPlayOnFocus !== false && focused && isVideoReady
          }
        />
        {(!focused || !isVideoReady) && poster && (
          <Photo
            style={StyleSheet.absoluteFill}
            uri={poster.uri}
            placeholder={poster.placeholder}
            showLoadingRing
          />
        )}
        {children}
      </Animated.View>
    );
  }
);

export default Video;

// export default memo<VideoProps>(
//   Video,
//   ({ children: children1, ...prop1 }, { children: children2, ...prop2 }) => {
//     return shallowEqual(prop1, prop2);
//   }
// );
