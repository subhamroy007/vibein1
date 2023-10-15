import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import AppText from "./AppText";
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
import { SIZE_16, SIZE_24 } from "../constants";
import Animated, { Layout } from "react-native-reanimated";

export type AppModalProps = {
  children: ReactNode;
  title: string;
  onDismiss: () => void;
  useMaxHeight?: boolean;
};

export default function SwipeUpPortal({
  children,
  title,
  onDismiss,
  useMaxHeight,
}: AppModalProps) {
  const { height: screenHeight } = useWindowDimensions();

  const { onLayout: onContentContainerLayout, height: contentContainerHeight } =
    useLayout();

  // const scrollToCallback = useCallback(
  //   (position: number) => {
  //     if (scrollViewRef.current) {
  //       scrollViewRef.current.scrollTo({
  //         animated: true,
  //         y: position === 0 ? 0 : contentContainerHeight,
  //         x: 0,
  //       });
  //     }
  //   },
  //   [contentContainerHeight]
  // );

  // const onScrollEndDragCallback = useCallback(
  //   ({
  //     nativeEvent: { contentOffset, velocity },
  //   }: NativeSyntheticEvent<NativeScrollEvent>) => {
  //     setDragging(false);
  //     if (velocity?.y! >= 9) {
  //       scrollToCallback(0);
  //     } else if (velocity?.y! <= -9) {
  //       scrollToCallback(1);
  //     } else {
  //       if (contentOffset.y < contentContainerHeight * 0.5) {
  //         scrollToCallback(0);
  //       } else {
  //         scrollToCallback(1);
  //       }
  //     }
  //   },
  //   [contentContainerHeight, scrollToCallback]
  // );

  // const onScrollBeginDragCallback = useCallback(() => setDragging(true), []);

  // const onMomentumScrollEndCallback = useCallback(
  //   ({
  //     nativeEvent: { contentOffset, velocity },
  //   }: NativeSyntheticEvent<NativeScrollEvent>) => {
  //     if (contentOffset.y === 0) {
  //       onDismiss();
  //     }
  //   },
  //   [onDismiss]
  // );

  // const onScrollCallback = useCallback(
  //   ({
  //     nativeEvent: { contentOffset, velocity },
  //   }: NativeSyntheticEvent<NativeScrollEvent>) => {
  //     if (contentOffset.y === 0 && !isDragging) {
  //       onDismiss();
  //     }
  //   },
  //   [onDismiss, isDragging]
  // );

  const backgroundPressCallback = useCallback(() => {
    // scrollToCallback(0);
  }, []);

  // useBackHandler(() => {
  //   scrollToCallback(0);
  //   return true;
  // });

  // useEffect(() => {
  //   scrollToCallback(1);
  // }, [scrollToCallback]);

  const { keyboardHeight, keyboardShown } = useKeyboard();

  const currentContainerHeight = useMaxHeight ? 540 : undefined;

  return (
    <Portal hostName="root">
      <Pressable
        style={[styles.root_container, StyleSheet.absoluteFill]}
        onPress={onDismiss}
      >
        <StatusBar translucent={true} hidden={false} />
        <Animated.View
          layout={Layout.duration(400)}
          style={[
            styles.content_container,
            {
              height: currentContainerHeight,
            },
          ]}
          onLayout={onContentContainerLayout}
        >
          <View style={[styles.title_container]}>
            <AppText weight="bold" size={SIZE_16}>
              {title}
            </AppText>
          </View>
          {children}
        </Animated.View>
      </Pressable>
    </Portal>
  );
}

const styles = StyleSheet.create({
  root_container: {
    ...backgroundStyle.background_color_3,
    ...layoutStyle.justify_content_flex_end,
  },
  content_container: {
    ...backgroundStyle.background_color_1,
    ...borderStyle.border_top_radius_12,
  },
  title_container: {
    ...borderStyle.border_bottom_width_hairline,
    ...borderStyle.border_bottom_color_2,
    ...layoutStyle.justify_content_center,
    ...layoutStyle.align_item_center,
    ...paddingStyle.padding_12,
  },
});
