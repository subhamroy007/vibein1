import { StyleSheet, View } from "react-native";
import { AccountParams } from "../../types/utility.types";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import { SIZE_24, SIZE_30, SIZE_36, SIZE_48 } from "../../constants";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import PressableIcon from "../utility-components/button/PressableIcon";
import OutlinedAvatar from "../utility-components/OutlinedAvatar";

export type PostFooterProps = {
  author: AccountParams;
  onMoreIconPress: () => void;
};

const PostFooter = ({ author, onMoreIconPress }: PostFooterProps) => {
  return (
    <View style={root_container_style}>
      <OutlinedAvatar
        url={author.profilePictureUri}
        size={SIZE_36}
        outlineWidth={5}
        gapWidth={3}
      />
      <Text weight="semi-bold" style={marginStyle.margin_left_9}>
        {author.username}
      </Text>
      <PressableIcon
        name="more-vert"
        size={SIZE_24}
        style={marginStyle.margin_left_auto}
        hitSlop={{ horizontal: SIZE_24, vertical: SIZE_24 }}
        onPress={onMoreIconPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root_container: {
    height: SIZE_48,
  },
});

const root_container_style = [
  styles.root_container,
  layoutStyle.flex_direction_row,
  layoutStyle.align_item_center,
  paddingStyle.padding_horizontal_9,
];

export default PostFooter;
