import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  LINE_WIDTH,
  LOGO_BLUE,
  LOGO_GREEN,
  SIZE_30,
  SIZE_60,
} from "../../constants";
import { backgroundStyle, layoutStyle } from "../../styles";
import Spinner from "../utility-components/Spinner";
import Icon from "../utility-components/icon/Icon";
import Animated, {
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Defs, LinearGradient, Stop, Svg } from "react-native-svg";
import AnimatedCircle from "../utility-components/AnimatedCircle";
import Pressable from "../utility-components/button/Pressable";

export type AudioMiniPlayerProps = {
  uri: string;
  start: number;
  end: number;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
};

export default function AudioMiniPlayer({
  end,
  start,
  uri,
  style,
}: AudioMiniPlayerProps) {
  const audioRef = useRef<Audio.Sound | null>(null);

  const [playing, setPlaying] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const playingAnimationValue = useSharedValue(0);

  useEffect(() => {
    return () => {
      audioRef.current?.unloadAsync();
    };
  }, []);

  const loadAudio = useCallback(async () => {
    try {
      setLoading(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        {
          progressUpdateIntervalMillis: 100,
          shouldPlay: false,
        },
        (status) => {
          if (status.isLoaded) {
            if (status.positionMillis >= end) {
              audioRef.current?.stopAsync();
              setPlaying(false);
              playingAnimationValue.value = 0;
            } else {
              setPlaying(status.isPlaying);
            }
          }
        }
      );
      audioRef.current = sound;
      sound.playFromPositionAsync(start);
      playingAnimationValue.value = withTiming(1, {
        duration: end - start,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const onPress = useCallback(() => {
    if (playing) {
      audioRef.current?.stopAsync();
      playingAnimationValue.value = 0;
    } else {
      if (audioRef.current) {
        audioRef.current.playFromPositionAsync(start);
        playingAnimationValue.value = withTiming(1, { duration: end - start });
      } else if (!isLoading) {
        loadAudio();
      }
    }
  }, [playing, isLoading]);

  const outlineWidth = 8 * LINE_WIDTH;

  const circumference = Math.PI * (SIZE_60 - outlineWidth);

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: interpolate(
        playingAnimationValue.value,
        [0, 1],
        [circumference, 0]
      ),
    };
  }, [circumference]);

  return (
    <Pressable
      animateOnPress
      style={[
        { width: SIZE_60, aspectRatio: 1, elevation: 3, borderRadius: SIZE_60 },
        backgroundStyle.background_color_1,
        layoutStyle.overflow_hidden,
        style,
        layoutStyle.align_item_center,
        layoutStyle.justify_content_center,
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <Spinner
          outlineWidth={8}
          size={SIZE_60}
          color="grad"
          style={layoutStyle.position_absolute}
        />
      ) : (
        <Svg
          style={[
            {
              bottom: 0,
            },
            layoutStyle.position_absolute,
          ]}
          fillOpacity={0}
        >
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={LOGO_GREEN} />
              <Stop offset="100%" stopColor={LOGO_BLUE} />
            </LinearGradient>
          </Defs>
          <AnimatedCircle
            stroke={`url(#grad)`}
            strokeWidth={outlineWidth}
            cx={SIZE_60 / 2}
            cy={SIZE_60 / 2}
            originX={SIZE_60 / 2}
            originY={SIZE_60 / 2}
            r={(SIZE_60 - outlineWidth) / 2}
            strokeDasharray={circumference}
            animatedProps={animatedCircleProps}
          />
        </Svg>
      )}
      <Icon size={SIZE_30} name={playing ? "pause" : "play"} />
    </Pressable>
  );
}
