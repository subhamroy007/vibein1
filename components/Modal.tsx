import { useBackHandler, useLayout } from "@react-native-community/hooks";
import { ReactNode, useCallback, useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { backgroundStyle, borderStyle, layoutStyle } from "../styles";
import {
  LOGO_BLUE,
  SIZE_12,
  SIZE_18,
  SIZE_4,
  SIZE_45,
  SIZE_70,
} from "../constants";
import { Portal } from "@gorhom/portal";
import { useDeviceLayout } from "../hooks/utility.hooks";
import Text from "./utility-components/text/Text";

export type ModalProps = {
  title?: string;
  children?: ReactNode;
  onDismiss: () => void;
  useMaxHeight?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onPartialOpen?: () => void;
  partialOpenThreshold?: number;
};

export type ModalState = "open" | "partial-open" | "close";

const Modal = ({
  children,
  title,
  onDismiss,
  useMaxHeight,
  partialOpenThreshold,
  onClose,
  onOpen,
  onPartialOpen,
}: ModalProps) => {
  const { height: screenHeight } = useDeviceLayout();

  const containerTranslateY = useSharedValue(screenHeight);
  const containerTranslateYOffset = useSharedValue(screenHeight);

  const { height: containerHeight, onLayout } = useLayout();
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: containerTranslateY.value,
        },
      ],
    };
  }, []);

  const switchState = useCallback(
    (state: ModalState) => {
      "worklet";
      if (containerHeight) {
        let newPosition = 0;
        if (state === "close") {
          newPosition = containerHeight;
        } else if (state === "partial-open" && partialOpenThreshold) {
          newPosition = Math.round(containerHeight * partialOpenThreshold);
        }
        containerTranslateY.value = withTiming(
          newPosition,
          { duration: 400 },
          (finished) => {
            containerTranslateYOffset.value = containerTranslateY.value;
            if (finished) {
              if (state === "open" && onOpen) {
                runOnJS(onOpen)();
              } else if (state === "close" && onClose) {
                runOnJS(onClose)();
                if (onDismiss) {
                  runOnJS(onDismiss)();
                }
              } else if (onPartialOpen) {
                runOnJS(onPartialOpen)();
              }
            }
          }
        );
      }
    },
    [
      containerHeight,
      partialOpenThreshold,
      onDismiss,
      onClose,
      onOpen,
      onPartialOpen,
    ]
  );

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      switchState("close");
    })
    .enabled(containerHeight > 0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      cancelAnimation(containerTranslateY);
    })
    .onChange(({ translationY }) => {
      containerTranslateY.value = Math.min(
        containerHeight,
        Math.max(0, translationY + containerTranslateYOffset.value)
      );
    })
    .onEnd(({ velocityY }) => {
      if (Math.abs(velocityY) >= 3000) {
        switchState(velocityY > 0 ? "close" : "open");
      } else {
        let lowerBound: ModalState = "close";
        let upperBound: ModalState = "open";
        let boundary = Math.round(containerHeight * 0.5);
        if (partialOpenThreshold) {
          const threshold = Math.round(containerHeight * partialOpenThreshold);
          lowerBound =
            containerTranslateY.value < threshold ? "partial-open" : "close";
          upperBound =
            containerTranslateY.value < threshold ? "open" : "partial-open";
          if (lowerBound === "close") {
            boundary = Math.round((threshold + containerHeight) * 0.5);
          } else {
            boundary = Math.round(threshold * 0.5);
          }
        }

        if (Math.abs(velocityY) >= 1000) {
          switchState(velocityY > 0 ? lowerBound : upperBound);
        } else {
          if (containerTranslateY.value >= boundary) {
            switchState(lowerBound);
          } else {
            switchState(upperBound);
          }
        }
      }
    })
    .enabled(containerHeight > 0);

  const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

  useBackHandler(() => {
    switchState("close");
    return true;
  });

  useEffect(() => {
    if (containerHeight) {
      switchState(partialOpenThreshold ? "partial-open" : "open");
    }
  }, [containerHeight, switchState, partialOpenThreshold]);

  const content_container_style: StyleProp<
    Animated.AnimateStyle<StyleProp<ViewStyle>>
  > = [
    {
      maxHeight: screenHeight,
      height: useMaxHeight ? screenHeight : "auto",
    },
    borderStyle.border_top_radius_12,
    layoutStyle.overflow_hidden,
    animatedContainerStyle,
    backgroundStyle.background_color_1,
  ];

  return (
    <Portal>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={root_container_style}>
          <Animated.View onLayout={onLayout} style={content_container_style}>
            <View style={title_container_style}>
              {title ? (
                <Text size={SIZE_18} weight="bold">
                  options
                </Text>
              ) : (
                <View style={styles.title_placeholder} />
              )}
            </View>
            {children}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title_container: { height: SIZE_45 },
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
];

const root_container_style = [
  backgroundStyle.background_color_3,
  StyleSheet.absoluteFill,
  layoutStyle.justify_content_flex_end,
];

export default Modal;
