import { useNetInfo } from "@react-native-community/netinfo";
import { Video as ExpoVideo, ResizeMode } from "expo-av";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ViewProps } from "react-native";
import { backgroundStyle, layoutStyle } from "../styles";
import Photo from "./Photo";
import { useIsFocused } from "../hooks/utility.hooks";
import { shallowEqual } from "react-redux";
import { COLOR_1, COLOR_4 } from "../constants";

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
      } catch (error) {
        setError(error);
      }
    }, []);

    const unloadVideo = useCallback(async () => {
      setError(null);
      setVideoReady(false);
      if (videoRef.current) {
        await videoRef.current.unloadAsync();
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
      if (focused && isVideoReady && autoPlayOnFocus !== false) {
        videoRef.current?.playAsync();
      }

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

    const videoReadyCallback = useCallback(() => {
      setVideoReady(true);
    }, []);

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
      <ExpoVideo
        ref={videoRef}
        isMuted={muted}
        resizeMode={contained ? ResizeMode.CONTAIN : ResizeMode.COVER}
        {...restProps}
        onReadyForDisplay={videoReadyCallback}
        onError={errorCallback}
        style={[
          { backgroundColor: calculatedBackgroundColor },
          style ? style : layoutStyle.fill,
        ]}
        isLooping={repeat}
        shouldPlay={!paused}
      >
        {poster && <Photo uri={poster.uri} showLoadingRing />}
      </ExpoVideo>
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
