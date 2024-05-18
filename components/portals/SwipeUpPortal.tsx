import { useBackHandler } from "@react-native-community/hooks";
import {
  ForwardRefRenderFunction,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  FlatListProps,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
} from "../../styles";
import Text from "../utility-components/text/Text";
import {
  DOVE_GREY,
  SIZE_12,
  SIZE_17,
  SIZE_4,
  SIZE_45,
  SIZE_60,
} from "../../constants";
import {
  ExclusiveGesture,
  Gesture,
  GestureDetector,
  PanGesture,
  TapGesture,
} from "react-native-gesture-handler";
import { useDeviceLayout } from "../../hooks/utility.hooks";

export type SwipeUpPortalProps = {
  title?: string;
  children?: ReactNode;
  onOpen?: () => void;
  onClose: () => void;
  onPartialOpen?: () => void;
  contentHeight: number;
  position?: SharedValue<number>;
  footer?: ReactNode;
  footerStyle?: StyleProp<ViewStyle>;
};

export type SwipeUpPortalRefParams = {
  open: () => void;
  close: (callback?: () => void) => void;
  // move: (position: number) => void;
  // release: (velocity: number) => void;
};

const PortalComponent: ForwardRefRenderFunction<
  SwipeUpPortalRefParams,
  SwipeUpPortalProps
> = (
  {
    children,
    title,
    onClose,
    onOpen,
    onPartialOpen,
    contentHeight,
    position,
    footer,
    footerStyle,
  }: SwipeUpPortalProps,
  ref
) => {
  const { height: window_height } = useWindowDimensions();

  // const { cappedHeight: window_height } = useDeviceLayout();

  const headerHeight = title ? SIZE_60 : SIZE_45;

  const height = Math.min(contentHeight + headerHeight, window_height);

  const containerTranslateY = useSharedValue(0);
  const containerTranslateYOffset = useSharedValue(0);
  const canOpenPartially = useRef(false);

  canOpenPartially.current = height >= 0.75 * window_height;

  const openPortal = useCallback(() => {
    "worklet";

    containerTranslateY.value = withTiming(1, { duration: 500 }, (finished) => {
      containerTranslateYOffset.value = containerTranslateY.value;
      if (finished && onOpen) {
        runOnJS(onOpen)();
      }
    });
  }, [onOpen]);

  const closePortal = useCallback(
    (onFinish?: any) => {
      "worklet";

      containerTranslateY.value = withTiming(
        0,
        { duration: 500 },
        (finished) => {
          containerTranslateYOffset.value = containerTranslateY.value;
          if (finished) {
            if (onFinish && typeof onFinish === "function") {
              runOnJS(onFinish)();
            }
            runOnJS(onClose)();
          }
        }
      );
    },
    [onClose]
  );

  const partiallyOpenPortal = useCallback(() => {
    "worklet";

    containerTranslateY.value = withTiming(
      0.7,
      { duration: 500 },
      (finished) => {
        containerTranslateYOffset.value = containerTranslateY.value;
        if (finished && onPartialOpen) {
          runOnJS(onPartialOpen)();
        }
      }
    );
  }, [onPartialOpen]);

  const onRelease = useCallback(
    ({ velocityY }: { velocityY: number }) => {
      "worklet";
      let upperBound = 1;
      let lowerBound = 0;
      let threshold = (upperBound + lowerBound) / 2;
      if (canOpenPartially.current) {
        if (containerTranslateY.value >= threshold) {
          lowerBound = threshold;
        } else {
          upperBound = threshold;
        }
        threshold = (upperBound + lowerBound) / 2;
      }
      if (Math.abs(velocityY) >= 2000) {
        if (velocityY > 0) {
          lowerBound === 0 ? closePortal() : partiallyOpenPortal();
        } else {
          upperBound === 1 ? openPortal() : partiallyOpenPortal();
        }
      } else {
        if (containerTranslateY.value >= threshold) {
          upperBound === 1 ? openPortal() : partiallyOpenPortal();
        } else {
          lowerBound === 0 ? closePortal() : partiallyOpenPortal();
        }
      }
    },
    [openPortal, closePortal, partiallyOpenPortal]
  );

  const onDrag = useCallback(
    ({ translationY }: { translationY: number }) => {
      "worklet";
      const offset = interpolate(
        containerTranslateYOffset.value,
        [0, 1],
        [0, -height]
      );
      const newPosition = interpolate(
        offset + translationY,
        [-height, 0],
        [1, 0],
        Extrapolate.CLAMP
      );
      containerTranslateY.value = newPosition;
    },
    [height]
  );

  useDerivedValue(() => {
    if (position) {
      position.value = containerTranslateY.value;
    }
  }, [position]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            containerTranslateY.value,
            [0, 1],
            [0, -height]
          ),
        },
      ],
    };
  }, [height]);

  const content_container_style: StyleProp<
    Animated.AnimateStyle<StyleProp<ViewStyle>>
  > = [
    {
      height,
      top: "100%",
    },
    animatedContainerStyle,
    borderStyle.border_top_radius_12,
    layoutStyle.overflow_hidden,
    backgroundStyle.background_color_1,
  ];

  useBackHandler(() => {
    closePortal();
    return true;
  });

  useEffect(() => {
    canOpenPartially.current ? partiallyOpenPortal() : openPortal();
  }, []);

  const tapGesture = useMemo<TapGesture>(
    () => Gesture.Tap().onStart(closePortal),
    [closePortal]
  );

  const dragGesture = useMemo<PanGesture>(
    () => Gesture.Pan().onChange(onDrag).onEnd(onRelease),
    [onDrag, onRelease]
  );

  const combinedGesture = useMemo<ExclusiveGesture>(
    () => Gesture.Exclusive(dragGesture, tapGesture),
    [dragGesture, tapGesture]
  );

  useImperativeHandle(
    ref,
    () => {
      return { close: closePortal, open: openPortal };
    },
    [openPortal]
  );

  return (
    <View
      style={[
        backdrop_style,
        { height: window_height + (StatusBar.currentHeight || 0) },
      ]}
    >
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={StyleSheet.absoluteFill} />
      </GestureDetector>

      <Animated.View style={content_container_style}>
        <GestureDetector gesture={dragGesture}>
          <Animated.View
            style={[title_container_style, { height: headerHeight }]}
          >
            {title !== undefined && (
              <Text
                size={SIZE_17}
                weight="semi-bold"
                style={marginStyle.margin_bottom_9}
              >
                {title}
              </Text>
            )}
            <View style={styles.title_placeholder} />
          </Animated.View>
        </GestureDetector>
        <View style={layoutStyle.flex_fill}>{children}</View>
      </Animated.View>
      {footer && (
        <View
          style={[
            { bottom: 0 },
            layoutStyle.position_absolute,
            layoutStyle.width_100_percent,
            footerStyle,
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title_container: { zIndex: 20 },
  title_placeholder: {
    width: SIZE_60,
    height: SIZE_4,
    backgroundColor: DOVE_GREY,
    borderRadius: SIZE_12,
  },
});

const title_container_style = [
  styles.title_container,
  layoutStyle.content_center,
  borderStyle.border_bottom_width_hairline,
  borderStyle.border_color_2,
  backgroundStyle.background_color_1,
];

const backdrop_style = [
  backgroundStyle.background_color_3,
  layoutStyle.position_absolute,
  layoutStyle.width_100_percent,
];

const SwipeUpPortal = forwardRef<SwipeUpPortalRefParams, SwipeUpPortalProps>(
  PortalComponent
);

export default SwipeUpPortal;
