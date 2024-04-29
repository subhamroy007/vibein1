import { useNetInfo } from "@react-native-community/netinfo";
import { AVPlaybackStatus, Video as ExpoVideo, ResizeMode } from "expo-av";
import {
  forwardRef,
  memo,
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
import { shallowEqual } from "react-redux";

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
  muted?: boolean;
  paused?: boolean;
  onReady?: () => void;
  onPlaybackStateChange?: (state: AVPlaybackStatus) => void;
  shouldPlayOnFocus?: boolean;
  shouldRestartOnBlur?: boolean;
  shouldRestartOnScreenBlur?: boolean;
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
      shouldPlayOnFocus,
      shouldRestartOnBlur,
      shouldRestartOnScreenBlur,
      muted,
      onReady,
      onPlaybackStateChange,
      ...restProps
    },
    ref
  ) => {
    const videoRef = useRef<ExpoVideo | null>(null); //intialize the reference for the video

    const autoPlayRef = useRef(false); //intialize the reference for the  play of fucus prop
    const restartOnBlurRef = useRef(false); //initialize the referecne for the restart on blur prop
    const restartOnScreenBlurRef = useRef(false); //initialize the reference for the restart on screen blur prop
    const positionRef = useRef(0); //intialize the video position reference
    const muteRef = useRef(false);
    const repeatRef = useRef(false);

    repeatRef.current = repeat || false;
    muteRef.current = muted || false;
    autoPlayRef.current = shouldPlayOnFocus || false;
    restartOnBlurRef.current = shouldRestartOnBlur || false;
    restartOnScreenBlurRef.current = shouldRestartOnScreenBlur || false;

    //define the handler to expose the imperative functions of the component which will be callable from outside of the component
    useImperativeHandle(ref, () => {
      return {
        //function to pause the video
        pause() {
          videoRef.current?.pauseAsync();
        },
        //function to play the video
        play() {
          videoRef.current?.playAsync();
        },
        //function to change the plaback position
        seek(position) {
          videoRef.current?.playFromPositionAsync(position);
        },
      };
    });

    const [isVideoReady, setVideoReady] = useState(false);

    const [isFinished, setFinished] = useState(false);

    const isScreenFocused = useIsFocused(); //initialize the screen focus hook

    const { isInternetReachable } = useNetInfo(); //intiailze the net-info hook to check for internet reachability

    const timemoutRef = useRef<NodeJS.Timeout>(); //intialize the timeout referecence to implement video retry

    const [isError, setError] = useState(false); //initialize the video error state

    //callback function to load a video from the given source
    const loadVideo = useCallback(async () => {
      setError(false);
      try {
        await videoRef.current?.loadAsync(
          { uri },
          {
            shouldPlay: false,
            positionMillis: positionRef.current,
            isMuted: muteRef.current,
            isLooping: repeatRef.current,
          }
        );
      } catch (error) {
        setError(true);
      }
    }, [uri]);

    //callback function, invoked when the video is ready to display
    const onVideoReady = useCallback(() => {
      setVideoReady(true);
      if (onReady) {
        onReady();
      }
    }, [onReady]);

    //callback function, invoked every time the internal state changes
    const onPlaybackStatusUpdate = useCallback(
      (status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          if (status.didJustFinish && !status.isLooping) {
            setFinished(true);
            positionRef.current = 0;
          } else {
            positionRef.current = status.positionMillis;
          }
        }
        if (onPlaybackStateChange) {
          onPlaybackStateChange(status);
        }
      },
      [onPlaybackStateChange]
    );

    //reset all the defined states when the uri of the video source changes
    useEffect(() => {
      setVideoReady(false);
      setError(false);
      setFinished(false);
      positionRef.current = 0;
    }, [uri]);

    //effect callback to load and unload the video accordingly when the preload state and/or screen focused state changes
    useEffect(() => {
      if (preload && isScreenFocused) {
        loadVideo();
      } else {
        setError(false);
        setVideoReady(false);
        setFinished(false);
        if (!preload || (!isScreenFocused && restartOnScreenBlurRef.current)) {
          positionRef.current = 0;
        }
        videoRef.current?.unloadAsync();
      }
    }, [preload, isScreenFocused, loadVideo]);

    //effect callback to play and pause the video accordingly when the focused and/or puased state changes
    useEffect(() => {
      if (focused && !paused && isVideoReady && autoPlayRef.current) {
        setFinished(false);
        videoRef.current?.playAsync();
      } else {
        if (!focused && restartOnBlurRef.current) {
          positionRef.current = 0;
          videoRef.current?.playFromPositionAsync(0);
        }
        videoRef.current?.pauseAsync();
      }
    }, [focused, paused, isVideoReady]);

    //effect callback to repeteadly try to load the video from the source in case of error
    useEffect(() => {
      if (isError && isInternetReachable && preload && isScreenFocused) {
        timemoutRef.current = setTimeout(() => loadVideo(), 2000);
      }

      return () => {
        clearTimeout(timemoutRef.current);
      };
    }, [loadVideo, isError, isInternetReachable, isScreenFocused]);

    const calculatedBackgroundColor =
      !background || background === "transparent"
        ? undefined
        : background === "light"
        ? COLOR_1
        : COLOR_4;
    return (
      <Animated.View
        style={[{ backgroundColor: calculatedBackgroundColor }, style]}
        {...restProps}
      >
        <ExpoVideo
          ref={videoRef}
          progressUpdateIntervalMillis={100}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          isMuted={muted}
          resizeMode={contained ? ResizeMode.CONTAIN : ResizeMode.COVER}
          onReadyForDisplay={onVideoReady}
          style={StyleSheet.absoluteFill}
        />
        {(!isVideoReady || isFinished) && poster && (
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

export default memo<VideoProps>(
  Video,
  ({ children: children1, ...prop1 }, { children: children2, ...prop2 }) => {
    return shallowEqual(prop1, prop2);
  }
);
