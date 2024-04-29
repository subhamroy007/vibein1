import { ReactNode, useCallback, useEffect } from "react";
import { StatusBar, StyleSheet, View, useWindowDimensions } from "react-native";
import {
  useBackHandler,
  useKeyboard,
  useLayout,
} from "@react-native-community/hooks";
import { Portal } from "@gorhom/portal";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
} from "../styles";
import { SIZE_16 } from "../constants";
import Animated, {
  Layout,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "./utility-components/text/Text";

export type AppModalProps = {
  children: ReactNode;
  title: string;
  onDismiss: () => void;
  useFullScreen?: boolean;
  useBreakPoint?: boolean;
};

export default function SwipeUpPortal({
  children,
  title,
  onDismiss,
  useFullScreen,
  useBreakPoint,
}: AppModalProps) {
  const { onLayout: onContentContainerLayout, height: contentContainerHeight } =
    useLayout();

  const { height: screenHeight } = useWindowDimensions();

  const { top } = useSafeAreaInsets();

  const { keyboardHeight, keyboardShown } = useKeyboard();

  const calculatedHeight = useFullScreen
    ? keyboardShown
      ? screenHeight - keyboardHeight - top
      : screenHeight - top
    : undefined;

  const translateYAnimatedValue = useSharedValue(0);

  const translateYReference = useSharedValue(0);

  const switchTo = useCallback(
    (fraction: number) => {
      if (contentContainerHeight > 0) {
        const newTranslation = Math.round(-contentContainerHeight * fraction);

        translateYAnimatedValue.value = withTiming(
          newTranslation,
          {
            duration: 300,
          },
          (value) => {
            translateYReference.value = newTranslation;
            if (fraction === 0) {
              runOnJS(onDismiss)();
            }
          }
        );
      }
    },
    [contentContainerHeight, onDismiss]
  );

  useEffect(() => {
    switchTo(useBreakPoint ? 0.7 : 1);
  }, [switchTo, useBreakPoint]);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-40, 40])
    .onEnd((arg) => {
      if (arg.velocityY >= 2500) {
        runOnJS(switchTo)(0);
      } else if (arg.velocityY <= -2500) {
        runOnJS(switchTo)(1);
      } else {
        const fraction =
          translateYAnimatedValue.value / -contentContainerHeight;

        const offsets = useBreakPoint ? [0, 0.7, 1] : [0, 1];

        const upperBoundIndex = offsets.findIndex(
          (offset) => fraction < offset
        );
        const upperBound = offsets[upperBoundIndex];
        const lowerBound = offsets[upperBoundIndex - 1];

        if (fraction > (upperBound + lowerBound) / 2) {
          runOnJS(switchTo)(upperBound);
        } else {
          runOnJS(switchTo)(lowerBound);
        }
      }
    })
    .onUpdate((arg) => {
      translateYAnimatedValue.value = Math.max(
        -contentContainerHeight,
        Math.min(0, translateYReference.value + arg.translationY)
      );
    })
    .onStart((arg) => {
      translateYReference.value = translateYAnimatedValue.value;
    });

  const animatedContentContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateYAnimatedValue.value }],
    };
  });

  useBackHandler(() => {
    switchTo(0);
    return true;
  });

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      runOnJS(switchTo)(0);
    })
    .enabled(false);

  const complexGesture = Gesture.Exclusive(tapGesture, panGesture);

  return (
    <Portal hostName="root">
      <GestureDetector gesture={complexGesture}>
        <Animated.View
          style={[
            styles.root_container,
            StyleSheet.absoluteFill,
            { marginTop: top },
          ]}
        >
          <Animated.View
            style={[
              styles.content_container,
              {
                height: calculatedHeight,
              },
              animatedContentContainerStyle,
            ]}
            onLayout={onContentContainerLayout}
          >
            <View style={[styles.title_container]}>
              <Text weight="bold" size={SIZE_16}>
                {title}
              </Text>
            </View>
            {children}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Portal>
  );
}

const styles = StyleSheet.create({
  root_container: {
    ...backgroundStyle.background_color_3,
  },
  content_container: {
    ...backgroundStyle.background_color_1,
    ...borderStyle.border_top_radius_12,
    top: "100%",
  },
  title_container: {
    ...borderStyle.border_bottom_width_hairline,
    ...borderStyle.border_bottom_color_2,
    ...layoutStyle.justify_content_center,
    ...layoutStyle.align_item_center,
    ...paddingStyle.padding_12,
  },
});
