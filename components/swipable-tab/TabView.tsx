import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PressableAndroidRippleConfig,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { Route, TabBar } from "react-native-tab-view";
import { backgroundStyle, borderStyle, layoutStyle } from "../../styles";
import { Layout, Scene } from "react-native-tab-view/lib/typescript/src/types";
import { memo, useCallback, useMemo, useRef } from "react";
import { useLayout } from "@react-native-community/hooks";
import { shallowEqual } from "react-redux";
import Icon from "../utility-components/icon/Icon";
import { COLOR_4, SIZE_27 } from "../../constants";
import Text from "../utility-components/text/Text";
import { IconName } from "../../types/component.types";

const ripple: PressableAndroidRippleConfig = { radius: 0 };

export type TabViewProps = {
  routes: Route[];
  index: number;
  setIndex: (value: number) => void;
  renderTabs: (route: Route, layout: Layout) => JSX.Element | undefined;
  initialLayout?: Layout;
  style?: StyleProp<ViewStyle>;
};

const TabView = ({
  index,
  renderTabs,
  routes,
  setIndex,
  initialLayout,
  style,
}: TabViewProps) => {
  const { x, y, onLayout, ...layout } = useLayout();

  const scrollRef = useRef<ScrollView>(null);

  const offset = useRef(new Animated.Value(0)).current;

  const interpolatedOffset = useMemo(() => {
    return offset.interpolate<number>({
      inputRange: [0, (routes.length - 1) * layout.width],
      outputRange: [0, routes.length - 1],
    });
  }, [routes.length, layout.width, offset]);

  const onScroll = useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { x: offset },
            },
          },
        ],
        { useNativeDriver: true }
      ),
    [offset]
  );

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setIndex(Math.round(contentOffset.x / layout.width));
    },
    [layout.width]
  );

  const jumpTo = useCallback(
    (key: string) => {
      const targetIndex = routes.findIndex((route) => route.key === key);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          animated: true,
          y: 0,
          x: targetIndex * layout.width,
        });
        setIndex(targetIndex);
      }
    },
    [routes, layout.width]
  );

  const renderLabel = useCallback(
    ({
      route,
      color,
    }: Scene<Route> & {
      focused: boolean;
      color: string;
    }) => {
      if (!route.title) return null;
      return (
        <Text weight="bold" color={color}>
          {route.title}
        </Text>
      );
    },
    []
  );

  const renderIcon = useCallback(
    ({
      route,
      color,
    }: Scene<Route> & {
      focused: boolean;
      color: string;
    }) => {
      if (!route.icon) return null;
      return (
        <Icon name={route.icon as IconName} color={color} size={SIZE_27} />
      );
    },
    []
  );

  return (
    <View
      style={[layoutStyle.flex_1, { ...initialLayout }, style]}
      onLayout={onLayout}
    >
      <TabBar
        jumpTo={jumpTo}
        layout={layout}
        navigationState={{ index, routes }}
        position={interpolatedOffset}
        renderLabel={renderLabel}
        renderIcon={renderIcon}
        inactiveColor="grey"
        activeColor={COLOR_4}
        bounces={false}
        android_ripple={ripple}
        style={[
          {
            backgroundColor: "transparent",
            elevation: 0,
          },
          borderStyle.border_bottom_width_hairline,
          borderStyle.border_color_2,
        ]}
        indicatorStyle={backgroundStyle.background_color_4}
      />
      <Animated.ScrollView
        ref={scrollRef}
        style={layoutStyle.flex_1}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        nestedScrollEnabled
        scrollEventThrottle={8}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScroll={onScroll}
      >
        {routes.map((route) => renderTabs(route, layout))}
      </Animated.ScrollView>
    </View>
  );
};

export default memo(TabView, shallowEqual);
