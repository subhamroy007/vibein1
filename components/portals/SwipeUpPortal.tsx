import { useBackHandler } from "@react-native-community/hooks";
import {
  ForwardRefRenderFunction,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { backgroundStyle, borderStyle, layoutStyle } from "../../styles";
import Text from "../utility-components/text/Text";
import {
  LOGO_BLUE,
  SIZE_12,
  SIZE_17,
  SIZE_4,
  SIZE_45,
  SIZE_70,
  screenHeight,
  windowHeight,
} from "../../constants";

export type SwipeUpPortalProps = {
  title?: string;
  children?: ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  onPartialOpen?: () => void;
  position?: SharedValue<number>;
  contentContainerStyle?: StyleProp<
    Animated.AnimateStyle<StyleProp<ViewStyle>>
  >;
  containerHeight: number;
};

export type SwipeUpPortalRefParams = {
  open: (callback?: () => void) => void;
  close: (callback?: () => void) => void;
  move: (position: number) => void;
  release: (velocity: number) => void;
};

export type ModalState = "open" | "partial-open" | "close";

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
    position,
    contentContainerStyle,
    containerHeight,
  }: SwipeUpPortalProps,
  ref
) => {
  const containerTranslateY = useSharedValue(containerHeight);
  const containerTranslateYOffset = useSharedValue(containerHeight);
  const canPartiallyOpen = containerHeight >= windowHeight * 0.7;
  const patialOpenBoundary = Math.round(containerHeight * 0.4);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: containerTranslateY.value,
        },
      ],
    };
  }, []);

  const changePortalPostion = useCallback(
    (newPosition: number, callback?: () => void) => {
      "worklet";
      containerTranslateY.value = withTiming(
        newPosition,
        { duration: 400 },
        (finished) => {
          containerTranslateYOffset.value = containerTranslateY.value;
          if (finished && callback) {
            runOnJS(callback)();
          }
        }
      );
    },
    []
  );

  const tapCallback = useCallback(() => {
    "worklet";
    changePortalPostion(containerHeight, onClose);
  }, [onClose, containerHeight]);

  const dragStartCallback = useCallback(() => {
    "worklet";
    cancelAnimation(containerTranslateY);
  }, []);

  const dragCallback = useCallback(
    ({ translationY }: { translationY: number }) => {
      "worklet";
      containerTranslateY.value = Math.min(
        containerHeight,
        Math.max(0, translationY + containerTranslateYOffset.value)
      );
    },
    [containerHeight]
  );

  const dragEndCallback = useCallback(
    ({ velocityY }: { velocityY: number }) => {
      "worklet";
      let lowerBound = containerHeight;
      let upperBound = 0;
      let threshold = Math.round(containerHeight * 0.5);
      if (canPartiallyOpen) {
        lowerBound =
          containerTranslateY.value < threshold
            ? patialOpenBoundary
            : lowerBound;
        upperBound =
          containerTranslateY.value < threshold
            ? upperBound
            : patialOpenBoundary;
        threshold = Math.round((lowerBound + upperBound) * 0.5);
      }

      if (Math.abs(velocityY) >= 1000) {
        if (velocityY > 0) {
          changePortalPostion(
            lowerBound,
            lowerBound === containerHeight ? onClose : onPartialOpen
          );
        } else {
          changePortalPostion(
            upperBound,
            upperBound === 0 ? onOpen : onPartialOpen
          );
        }
      } else {
        if (containerTranslateY.value >= threshold) {
          changePortalPostion(
            lowerBound,
            lowerBound === containerHeight ? onClose : onPartialOpen
          );
        } else {
          changePortalPostion(
            upperBound,
            upperBound === 0 ? onOpen : onPartialOpen
          );
        }
      }
    },
    [
      containerHeight,
      patialOpenBoundary,
      onClose,
      onOpen,
      onPartialOpen,
      canPartiallyOpen,
    ]
  );

  const tapGesture = Gesture.Tap().onStart(tapCallback);

  const panGesture = Gesture.Pan()
    .onStart(dragStartCallback)
    .onChange(dragCallback)
    .onEnd(dragEndCallback);

  useDerivedValue(() => {
    if (position) {
      position.value = containerTranslateY.value;
    }
  }, [position]);

  const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

  useBackHandler(() => {
    changePortalPostion(containerHeight, onClose);
    return true;
  });

  useEffect(() => {
    if (canPartiallyOpen) {
      changePortalPostion(patialOpenBoundary, onPartialOpen);
    } else {
      changePortalPostion(0, onOpen);
    }
  }, [canPartiallyOpen, patialOpenBoundary, onPartialOpen, onOpen]);

  useImperativeHandle(
    ref,
    () => {
      return {
        open(callback) {
          if (containerHeight) {
            changePortalPostion(0, () => {
              if (onOpen) {
                onOpen();
              }
              if (callback) {
                callback();
              }
            });
          }
        },
        close(callback) {
          changePortalPostion(containerHeight, () => {
            if (onClose) {
              onClose();
            }
            if (callback) {
              callback();
            }
          });
        },
        move(position) {
          "worklet";
          dragCallback({ translationY: position });
        },
        release(velocity) {
          "worklet";
          dragEndCallback({ velocityY: velocity });
        },
      };
    },
    [
      changePortalPostion,
      containerHeight,
      onClose,
      onOpen,
      dragCallback,
      // dragEndCallback,
    ]
  );

  const content_container_style: StyleProp<
    Animated.AnimateStyle<StyleProp<ViewStyle>>
  > = [
    {
      height: containerHeight,
      marginTop: screenHeight - containerHeight,
    },
    borderStyle.border_top_radius_12,
    layoutStyle.overflow_hidden,
    animatedContainerStyle,
    backgroundStyle.background_color_1,
    contentContainerStyle,
  ];
  return (
    <View style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={backdrop_style} />
      </GestureDetector>
      <Animated.View style={content_container_style}>
        <GestureDetector gesture={combinedGesture}>
          <Animated.View style={title_container_style}>
            {title ? (
              <Text size={SIZE_17} weight="bold">
                {title}
              </Text>
            ) : (
              <View style={styles.title_placeholder} />
            )}
          </Animated.View>
        </GestureDetector>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  title_container: { height: SIZE_45, zIndex: 20 },
  title_placeholder: {
    width: SIZE_70,
    height: SIZE_4,
    backgroundColor: LOGO_BLUE,
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
  StyleSheet.absoluteFill,
];

const SwipeUpPortal = forwardRef<SwipeUpPortalRefParams, SwipeUpPortalProps>(
  PortalComponent
);

export default SwipeUpPortal;
