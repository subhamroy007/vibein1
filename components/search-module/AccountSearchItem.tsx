import { TouchableHighlight } from "react-native-gesture-handler";
import { SIZE_1, SIZE_12, SIZE_14, SIZE_54, SIZE_70 } from "../../constants";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import Avatar from "../Avatar";
import { View } from "react-native";
import Text from "../utility-components/text/Text";
import { formatNumber } from "../../utility";
import { AccountSearchParams } from "../../types/utility.types";

const AccountSearchItem = ({
  category,
  userId,
  name,
  profilePictureUri,
  noOfFollowers,
}: AccountSearchParams) => {
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
        <Avatar url={profilePictureUri} size={SIZE_54} />
        <View style={marginStyle.margin_left_9}>
          <Text weight="semi-bold" size={SIZE_14}>
            {userId}
          </Text>
          <Text
            weight="semi-bold"
            size={SIZE_14}
            color="grey"
            style={{ marginTop: SIZE_1 }}
          >
            {name}
          </Text>
          <Text
            size={SIZE_12}
            weight="semi-bold"
            color="grey"
            style={{ marginTop: SIZE_1 }}
          >
            {formatNumber(noOfFollowers!)} followers
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default AccountSearchItem;
