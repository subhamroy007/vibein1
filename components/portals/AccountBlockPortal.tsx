import { View } from "react-native";
import { SIZE_16, SIZE_20, SIZE_36, SIZE_90 } from "../../constants";
import { useAppSelector } from "../../hooks/storeHooks";
import { getProfilePictureUrl } from "../../mocks/data";
import { selectAccountParams } from "../../store/account-store/account.selectors";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import SwipeUpPortal, { SwipeUpPortalProps } from "./SwipeUpPortal";
import Button from "../utility-components/button/Button";
import Dot from "../utility-components/Dot";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useCallback } from "react";

export type AccountBlockPortalProps = {
  onBlock?: () => void;
  userId: string;
} & SwipeUpPortalProps;

export default function AccountBlockPortal({
  onBlock,
  userId,
  children,
  title,
  ...restProps
}: AccountBlockPortalProps) {
  const position = useSharedValue(0);

  const account = useAppSelector((state) => selectAccountParams(state, userId));

  const animatedButtonContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -position.value }],
  }));

  const onBlockButtonPress = useCallback(() => {
    restProps.onDismiss();
    if (onBlock) {
      onBlock();
    }
  }, [onBlock, restProps.onDismiss]);

  if (!account) return null;

  return (
    <SwipeUpPortal {...restProps} title="Block Account" position={position}>
      <View style={header_style}>
        <Avatar size={SIZE_90} url={account.profilePictureUri} />

        <Text size={SIZE_20} weight="bold" style={marginStyle.margin_top_6}>
          {account.userId}
        </Text>
        <Text color="grey" style={marginStyle.margin_top_6} numberOfLines={0}>
          are you sure you want to block {account.userId}?
        </Text>
      </View>
      <View style={list_item_style}>
        <Dot />
        <Text
          size={SIZE_16}
          numberOfLines={0}
          style={marginStyle.margin_horizontal_12}
        >
          They will not be able to find you, message you or see your content on
          vibein
        </Text>
      </View>
      <View style={list_item_style}>
        <Dot />
        <Text
          size={SIZE_16}
          style={marginStyle.margin_horizontal_12}
          numberOfLines={0}
        >
          They will not be notified that you blocked them
        </Text>
      </View>
      <View style={list_item_style}>
        <Dot />
        <Text size={SIZE_16} style={marginStyle.margin_horizontal_12}>
          You can unblock them anytime in Settings
        </Text>
      </View>
      <Animated.View
        style={[button_container_style, animatedButtonContainerStyle]}
      >
        <Button
          text={"Block"}
          width={"90%"}
          size={SIZE_36}
          scale={0.4}
          onPress={onBlockButtonPress}
          animateOnPress
        />
      </Animated.View>
    </SwipeUpPortal>
  );
}

const header_style = [paddingStyle.padding_12, layoutStyle.align_item_center];

const list_item_style = [
  layoutStyle.flex_direction_row,
  layoutStyle.align_item_center,
  paddingStyle.padding_horizontal_12,
  marginStyle.margin_vertical_6,
];

const button_container_style = [
  paddingStyle.padding_vertical_12,
  backgroundStyle.background_color_1,
  borderStyle.border_top_width_hairline,
  borderStyle.border_color_2,
  layoutStyle.align_item_center,
];
