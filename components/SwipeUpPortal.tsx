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
import { useBackHandler, useLayout } from "@react-native-community/hooks";
import { Portal } from "@gorhom/portal";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  paddingStyle,
} from "../styles";

export type AppModalProps = {
  children: ReactNode;
  title: string;
  onDismiss: () => void;
};

export default function SwipeUpPortal({
  children,
  title,
  onDismiss,
}: AppModalProps) {
  const { height: screenHeight } = useWindowDimensions();

  const [isDragging, setDragging] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const { onLayout: onContentContainerLayout, height: contentContainerHeight } =
    useLayout();

  const scrollToCallback = useCallback(
    (position: number) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          animated: true,
          y: position === 0 ? 0 : contentContainerHeight,
          x: 0,
        });
      }
    },
    [contentContainerHeight]
  );

  const onScrollEndDragCallback = useCallback(
    ({
      nativeEvent: { contentOffset, velocity },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setDragging(false);
      if (velocity?.y! >= 9) {
        scrollToCallback(0);
      } else if (velocity?.y! <= -9) {
        scrollToCallback(1);
      } else {
        if (contentOffset.y < contentContainerHeight * 0.5) {
          scrollToCallback(0);
        } else {
          scrollToCallback(1);
        }
      }
    },
    [contentContainerHeight, scrollToCallback]
  );

  const onScrollBeginDragCallback = useCallback(() => setDragging(true), []);

  const onMomentumScrollEndCallback = useCallback(
    ({
      nativeEvent: { contentOffset, velocity },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (contentOffset.y === 0) {
        onDismiss();
      }
    },
    [onDismiss]
  );

  const onScrollCallback = useCallback(
    ({
      nativeEvent: { contentOffset, velocity },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (contentOffset.y === 0 && !isDragging) {
        onDismiss();
      }
    },
    [onDismiss, isDragging]
  );

  const backgroundPressCallback = useCallback(() => {
    scrollToCallback(0);
  }, [scrollToCallback]);

  useBackHandler(() => {
    scrollToCallback(0);
    return true;
  });

  useEffect(() => {
    scrollToCallback(1);
  }, [scrollToCallback]);

  return (
    <Portal hostName="root">
      <View
        style={[backgroundStyle.background_color_3, StyleSheet.absoluteFill]}
      >
        <StatusBar translucent={true} hidden={false} />
        <ScrollView
          ref={scrollViewRef}
          decelerationRate={"fast"}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={onScrollBeginDragCallback}
          onScrollEndDrag={onScrollEndDragCallback}
          onMomentumScrollEnd={onMomentumScrollEndCallback}
          onScroll={onScrollCallback}
          keyboardShouldPersistTaps="always"
        >
          <Pressable
            style={{
              height: screenHeight,
            }}
            onPress={backgroundPressCallback}
          />
          <View
            style={[
              backgroundStyle.background_color_1,
              borderStyle.border_top_radius_12,
            ]}
            onLayout={onContentContainerLayout}
          >
            <View
              style={[
                borderStyle.border_bottom_width_hairline,
                borderStyle.border_bottom_color_2,
                layoutStyle.justify_content_center,
                layoutStyle.align_item_center,
                paddingStyle.padding_12,
                { zIndex: 20 },
              ]}
            >
              <AppText weight="bold" size={16}>
                {title}
              </AppText>
            </View>
            {children}
          </View>
        </ScrollView>
      </View>
    </Portal>
  );
}
