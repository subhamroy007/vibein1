import { View } from "react-native";
import { COLOR_2, SIZE_36, SIZE_45 } from "../../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import { HashTagSearchParams } from "../../types/utility.types";
import Pressable from "../utility-components/button/Pressable";
import Text from "../utility-components/text/Text";
import IconCircle from "../utility-components/icon/IconCircle";

export type HashtagListItemProps = {
  hashtag: HashTagSearchParams;
  onSelect: (name: string) => void;
};

export default function HashtagListItem({
  hashtag,
  onSelect,
}: HashtagListItemProps) {
  return (
    <Pressable
      useUnderlay
      onPress={() => onSelect(hashtag.name)}
      style={[
        { height: SIZE_45 },
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
        paddingStyle.padding_horizontal_9,
      ]}
    >
      <IconCircle
        name="hashtag"
        size={SIZE_36}
        outlineWidth={2}
        outlineColor={COLOR_2}
      />
      <View style={marginStyle.margin_left_9}>
        <Text weight="semi-bold">#{hashtag.name}</Text>
        <Text weight="semi-bold" color="grey">
          {hashtag.noOfPosts} posts
        </Text>
      </View>
    </Pressable>
  );
}
