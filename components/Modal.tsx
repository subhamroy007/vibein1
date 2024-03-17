import { useLayout } from "@react-native-community/hooks";
import { ReactNode, useCallback, useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  SlideInDown,
  SlideOutDown,
  cancelAnimation,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { backgroundStyle, borderStyle, layoutStyle } from "../styles";
import { LOGO_BLUE, SIZE_18, SIZE_4, SIZE_45, SIZE_70 } from "../constants";
import AppText from "./AppText";
import { Portal } from "@gorhom/portal";

const Modal = ({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) => {
  const { height: screenHeight } = useWindowDimensions();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollOffset = useScrollViewOffset(scrollRef);

  const containerTranslateY = useSharedValue(screenHeight * 0);
  const containerTranslateYOffset = useSharedValue(screenHeight * 0);

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

  const animateContainer = useCallback(
    (threshold: number) => {
      "worklet";
      if (containerHeight) {
        const calculatedThreshold = (1 - threshold) * containerHeight;

        containerTranslateY.value = withTiming(
          calculatedThreshold,
          { duration: 400 },
          () => {
            containerTranslateYOffset.value = containerTranslateY.value;
          }
        );
      }
    },
    [containerHeight]
  );

  useEffect(() => {
    animateContainer(1);
  }, [animateContainer]);

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      animateContainer(0);
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
      if (containerTranslateY.value >= containerHeight / 2) {
        animateContainer(0);
      } else {
        animateContainer(1);
      }
    })
    .enabled(containerHeight > 0);

  const combinedGesture = Gesture.Exclusive(panGesture, tapGesture);

  return (
    <Portal>
      <GestureDetector gesture={combinedGesture}>
        <Animated.View
          style={[
            backgroundStyle.background_color_3,
            StyleSheet.absoluteFill,
            layoutStyle.justify_content_flex_end,
          ]}
        >
          <Animated.View
            entering={SlideInDown.duration(800)}
            exiting={SlideOutDown.duration(800)}
            onLayout={onLayout}
            style={[
              {
                maxHeight: screenHeight * 0.8,
              },
              borderStyle.border_top_radius_12,
              layoutStyle.overflow_hidden,
              animatedContainerStyle,
              backgroundStyle.background_color_1,
            ]}
          >
            <View
              style={[
                layoutStyle.justify_content_center,
                layoutStyle.align_item_center,
                { height: SIZE_45 },
                borderStyle.border_bottom_width_hairline,
                borderStyle.border_color_2,
              ]}
            >
              {title ? (
                <AppText size={SIZE_18} weight="bold">
                  options
                </AppText>
              ) : (
                <View
                  style={[
                    {
                      width: SIZE_70,
                      height: SIZE_4,
                      backgroundColor: LOGO_BLUE,
                      borderRadius: 12,
                    },
                  ]}
                />
              )}
            </View>
            <Animated.ScrollView overScrollMode="never" ref={scrollRef}>
              {children}
            </Animated.ScrollView>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Portal>
  );
};

export default Modal;
