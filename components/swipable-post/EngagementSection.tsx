import Animated from "react-native-reanimated";
import {
  COLOR_1,
  COLOR_6,
  LAYOUT_ANIMATION_400,
  SIZE_24,
} from "../../constants";
import { StyleSheet, View } from "react-native";
import { layoutStyle, marginStyle } from "../../styles";
import Text from "../utility-components/text/Text";
import { formatNumber } from "../../utility";
import PressableIcon from "../utility-components/button/PressableIcon";
import Pressable from "../utility-components/button/Pressable";
import Icon from "../utility-components/icon/Icon";

type EngagementSectionProps = {
  isLiked: boolean;
  noOfLikes: number;
  onLikeIconPress: () => void;
  noOfComments: number;
  onCommentIconPress: () => void;
  onSendIconPress: () => void;
  onMoreIconPress: () => void;
};

const EngagementSection = ({
  isLiked,
  noOfComments,
  noOfLikes,
  onCommentIconPress,
  onLikeIconPress,
  onMoreIconPress,
  onSendIconPress,
}: EngagementSectionProps) => {
  return (
    <Animated.View layout={LAYOUT_ANIMATION_400} style={root_container_style}>
      <View style={layoutStyle.align_item_center}>
        <PressableIcon
          animateOnPress
          onPress={onLikeIconPress}
          name={isLiked ? "heart-solid" : "heart-outline"}
          color={isLiked ? COLOR_6 : COLOR_1}
        />
        <Text style={marginStyle.margin_top_6} color={COLOR_1} weight="regular">
          {noOfLikes > 1
            ? formatNumber(noOfLikes)
            : noOfLikes === 1 && isLiked
            ? "likes"
            : "1"}
        </Text>
      </View>
      <Pressable onPress={onCommentIconPress} style={comment_container_style}>
        <Icon name="comment-outline" color={COLOR_1} />
        {noOfComments > 0 && (
          <Text
            style={marginStyle.margin_top_6}
            color={COLOR_1}
            weight="regular"
          >
            {formatNumber(noOfComments)}
          </Text>
        )}
      </Pressable>

      <PressableIcon
        name="send-outline"
        color={COLOR_1}
        onPress={onSendIconPress}
        style={marginStyle.margin_top_12}
      />
      <PressableIcon
        name="more-vert"
        color={COLOR_1}
        size={SIZE_24}
        onPress={onMoreIconPress}
        style={marginStyle.margin_top_12}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root_container: {
    width: "16%",
    bottom: 24,
    right: 0,
  },
});

const root_container_style = [
  styles.root_container,
  layoutStyle.position_absolute,
  layoutStyle.align_item_center,
];

const comment_container_style = [
  layoutStyle.align_item_center,
  marginStyle.margin_top_12,
];

export default EngagementSection;
