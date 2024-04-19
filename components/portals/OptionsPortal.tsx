import {
  SIZE_15,
  SIZE_24,
  SIZE_45,
  SIZE_48,
  windowHeight,
} from "../../constants";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import { IconName } from "../../types/component.types";
import Pressable from "../utility-components/button/Pressable";
import Icon from "../utility-components/icon/Icon";
import Text from "../utility-components/text/Text";
import SwipeUpPortal from "./SwipeUpPortal";
import Animated from "react-native-reanimated";
import { usePortalAnimatedGesture } from "../../hooks/utility.hooks";

export type PortalOptionParams = {
  icon: IconName;
  label: string;
  color?: string;
  callback: () => void;
};

export type OptionsPortalProps = {
  options: PortalOptionParams[];
  onDismiss: () => void;
};

export default function OptionsPortal({
  onDismiss,
  options,
}: OptionsPortalProps) {
  const height = Math.min(windowHeight, options.length * SIZE_48 + SIZE_45);

  const {
    containerAnimatedStyle,
    onScroll,
    portalRef,
    scrollRef,
    portalPosition,
  } = usePortalAnimatedGesture(height);

  return (
    <SwipeUpPortal
      ref={(refer) => {
        if (refer) {
          portalRef.current = refer;
        }
      }}
      onClose={onDismiss}
      title="options"
      containerHeight={height}
      position={portalPosition}
    >
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        overScrollMode="never"
        contentContainerStyle={{ paddingTop: height }}
        showsVerticalScrollIndicator={false}
        contentOffset={{ x: 0, y: height }}
        style={backgroundStyle.background_dove_grey}
        scrollEventThrottle={16}
      >
        <Animated.View style={containerAnimatedStyle}>
          {options.map((option, index) => {
            return (
              <Pressable
                key={index}
                useUnderlay
                onPress={() => {
                  portalRef.current?.close(option.callback);
                }}
                style={[
                  layoutStyle.align_item_center,
                  layoutStyle.flex_direction_row,
                  paddingStyle.padding_horizontal_12,
                  { height: SIZE_48 },
                  backgroundStyle.background_color_1,
                ]}
              >
                <Icon name={option.icon} color={option.color} size={SIZE_24} />
                <Text
                  color={option.color}
                  style={marginStyle.margin_left_12}
                  size={SIZE_15}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>
      </Animated.ScrollView>
    </SwipeUpPortal>
  );
}
