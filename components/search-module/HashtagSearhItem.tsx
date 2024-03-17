import { TouchableHighlight } from "react-native-gesture-handler";
import { formatNumber } from "../../utility";
import { COLOR_2, SIZE_1, SIZE_14, SIZE_54, SIZE_70 } from "../../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import IconCircle from "../utility-components/icon/IconCircle";
import { View } from "react-native";
import Text from "../utility-components/text/Text";
import { HashTagSearchParams } from "../../types/utility.types";

const HashTagSearchItem = ({ name, noOfPosts }: HashTagSearchParams) => {
  let postText = "";
  if (noOfPosts < 100) {
    postText = "less then 100 post";
  } else {
    postText = formatNumber(noOfPosts) + " posts";
  }

  return (
    <TouchableHighlight>
      <View
        style={[
          { height: SIZE_70 },
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_horizontal_12,
        ]}
      >
        <IconCircle
          name="hashtag"
          outlineWidth={1}
          size={SIZE_54}
          outlineColor={COLOR_2}
          scale={0.5}
        />
        <View style={marginStyle.margin_left_9}>
          <Text weight="semi-bold" size={SIZE_14}>
            #{name}
          </Text>
          <Text
            weight="semi-bold"
            size={SIZE_14}
            color="grey"
            style={{ marginTop: SIZE_1 }}
          >
            {postText}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default HashTagSearchItem;
