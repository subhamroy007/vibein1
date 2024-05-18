import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { backgroundStyle, borderStyle, layoutStyle } from "../../styles";
import {
  DOVE_GREY,
  SIZE_12,
  SIZE_17,
  SIZE_4,
  SIZE_45,
  SIZE_70,
  windowHeight,
} from "../../constants";
import Text from "../utility-components/text/Text";
import {
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import Animated, {
  runOnJS,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useBackHandler, useLayout } from "@react-native-community/hooks";
import { shallowEqual } from "react-redux";

export type NewPortalProps = {
  title?: string;
  children?: ReactNode;
  useMaxHeight?: boolean;
  contentHeight?: number;
  useFlatList?: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onPartiallyOpen?: () => void;
};

export type NewPortalRefParams = {
  open: () => void;
  close: (callback?: () => void) => void;
  release: (velocity: number) => void;
};

const PortalComponent = forwardRef<NewPortalRefParams, NewPortalProps>(
  (
    {
      onClose,
      useMaxHeight,
      children,
      onOpen,
      onPartiallyOpen,
      title,
      useFlatList,
      contentHeight,
    },
    ref
  ) => {
    const { height: window_height } = useWindowDimensions();

    const { height, onLayout } = useLayout();

    const topScrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollAnimatedValue = useSharedValue(0);
    const isAnimating = useSharedValue(false);
    const canOpenPartially = useSharedValue(false);
    const topScrollOffset = useScrollViewOffset(topScrollRef);
    const isOpened = useRef(false);
    const testOffset = useSharedValue(0);

    canOpenPartially.value = height >= 0.75 * windowHeight;

    const openPortal = useCallback(() => {
      "worklet";
      scrollAnimatedValue.value = topScrollOffset.value;
      isAnimating.value = true;
      scrollAnimatedValue.value = withTiming(
        height,
        { duration: 400 },
        (finished) => {
          isAnimating.value = false;
          if (finished && onOpen) {
            runOnJS(onOpen)();
          }
        }
      );
    }, [height, onOpen]);

    const partiallyOpenPortal = useCallback(() => {
      "worklet";
      scrollAnimatedValue.value = topScrollOffset.value;
      isAnimating.value = true;
      scrollAnimatedValue.value = withTiming(
        height * 0.5,
        { duration: 400 },
        (finished) => {
          isAnimating.value = false;
          if (finished && onPartiallyOpen) {
            runOnJS(onPartiallyOpen)();
          }
        }
      );
    }, [height, onPartiallyOpen]);

    const closePortal = useCallback(
      (oFinish?: () => void) => {
        "worklet";
        scrollAnimatedValue.value = topScrollOffset.value;
        isAnimating.value = true;
        scrollAnimatedValue.value = withTiming(
          0,
          { duration: 200 },
          (finished) => {
            isAnimating.value = false;
            if (finished) {
              if (oFinish) {
                runOnJS(oFinish)();
              }
              runOnJS(onClose)();
            }
          }
        );
      },
      [onClose]
    );

    const releasePortal = useCallback(
      (velocity: number) => {
        "worklet";

        let upperBound = height;
        let lowerBound = 0;
        let threshold = (upperBound + lowerBound) / 2;
        if (canOpenPartially.value) {
          if (topScrollOffset.value >= threshold) {
            lowerBound = threshold;
          } else {
            upperBound = threshold;
          }
          threshold = (upperBound + lowerBound) / 2;
        }
        if (velocity && Math.abs(velocity) >= 1) {
          if (velocity > 0) {
            lowerBound === 0 ? closePortal() : partiallyOpenPortal();
          } else {
            upperBound === height ? openPortal() : partiallyOpenPortal();
          }
        } else {
          if (topScrollOffset.value >= threshold) {
            upperBound === height ? openPortal() : partiallyOpenPortal();
          } else {
            lowerBound === 0 ? closePortal() : partiallyOpenPortal();
          }
        }
      },
      [height, closePortal, partiallyOpenPortal, openPortal]
    );

    const onScroll = useAnimatedScrollHandler(
      {
        onEndDrag({ velocity }) {
          releasePortal(velocity ? velocity.y : 0);
        },
      },
      [releasePortal]
    );

    const onNestedScroll = useAnimatedScrollHandler(
      {
        onEndDrag({ velocity, contentOffset }) {
          if (contentOffset.y === 0) {
            releasePortal(velocity ? Math.abs(velocity.y) : 0);
          } else {
            releasePortal(0);
          }
        },
      },
      [releasePortal]
    );

    const onBackDropPress = useCallback(() => {
      closePortal();
    }, [closePortal]);

    useDerivedValue(() => {
      if (isAnimating.value) {
        scrollTo(topScrollRef, 0, scrollAnimatedValue.value, true);
      }
    }, []);

    const content_container_style: StyleProp<ViewStyle> = [
      {
        height: useMaxHeight
          ? window_height
          : contentHeight
          ? contentHeight
          : "auto",
      },
      borderStyle.border_top_radius_12,
      layoutStyle.overflow_hidden,
      backgroundStyle.background_color_1,
    ];

    useImperativeHandle(
      ref,
      () => {
        return {
          open: openPortal,
          close: closePortal,
          release: releasePortal,
        };
      },
      [openPortal, closePortal, releasePortal]
    );

    useEffect(() => {
      if (height && !isOpened.current) {
        isOpened.current = true;
        useMaxHeight ? partiallyOpenPortal() : openPortal();
      }
    }, [height, useMaxHeight, partiallyOpenPortal, openPortal]);

    useBackHandler(() => {
      closePortal();
      return true;
    });

    return (
      <View
        style={[StyleSheet.absoluteFill, backgroundStyle.background_color_3]}
      >
        <Animated.ScrollView
          ref={topScrollRef}
          style={[layoutStyle.flex_1]}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          decelerationRate={0}
          onScroll={onScroll}
          removeClippedSubviews={false}
        >
          <Pressable
            onPress={onBackDropPress}
            style={{
              height: windowHeight,
            }}
          />
          <Animated.View style={content_container_style} onLayout={onLayout}>
            <Animated.View style={title_container_style}>
              {title ? (
                <Text size={SIZE_17} weight="semi-bold">
                  {title}
                </Text>
              ) : (
                <View style={styles.title_placeholder} />
              )}
            </Animated.View>

            <Animated.ScrollView
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              style={[layoutStyle.flex_1, backgroundStyle.background_color_1]}
              nestedScrollEnabled
              horizontal={useFlatList}
              onScroll={useFlatList ? undefined : onNestedScroll}
            >
              {children}
            </Animated.ScrollView>
          </Animated.View>
        </Animated.ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  title_container: { height: SIZE_45, zIndex: 20 },
  title_placeholder: {
    width: SIZE_70,
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

const NewPortal = PortalComponent;

export default NewPortal;
