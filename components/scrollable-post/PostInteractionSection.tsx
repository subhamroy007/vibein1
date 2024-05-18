import { StyleSheet, View } from "react-native";
import { layoutStyle, paddingStyle } from "../../styles";
import { COLOR_6, SIZE_24, SIZE_27, SIZE_54 } from "../../constants";
import PressableIcon from "../utility-components/button/PressableIcon";
import CommentBoxPlaceHolder from "./CommentBoxPlaceHolder";

export type PostInteractionSectionProps = {
  isLiked: boolean;
  onLikeIconPress: () => void;
  onSendIconPress: () => void;
  onCommentBoxPress: () => void;
};

const PostInteractionSection = ({
  isLiked,
  onCommentBoxPress,
  onLikeIconPress,
  onSendIconPress,
}: PostInteractionSectionProps) => {
  return (
    <View style={root_container_style}>
      <PressableIcon
        onPress={onLikeIconPress}
        hitSlop={{ horizontal: SIZE_24, vertical: SIZE_24 }}
        name={isLiked ? "heart-solid" : "heart-outline"}
        size={SIZE_27}
        color={isLiked ? COLOR_6 : undefined}
      />
      <CommentBoxPlaceHolder onCommentBoxPress={onCommentBoxPress} />
      <PressableIcon
        name="send-outline"
        size={SIZE_27}
        onPress={onSendIconPress}
        hitSlop={{ horizontal: SIZE_24, vertical: SIZE_24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root_container: {
    height: SIZE_54,
  },
});

const root_container_style = [
  styles.root_container,
  layoutStyle.flex_direction_row,
  paddingStyle.padding_horizontal_12,
  layoutStyle.align_item_center,
  layoutStyle.justify_content_space_between,
];

export default PostInteractionSection;
