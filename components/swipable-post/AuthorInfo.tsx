import { View } from "react-native";
import { AccountParams } from "../../types/utility.types";
import Pressable from "../utility-components/button/Pressable";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import { layoutStyle, marginStyle } from "../../styles";
import { COLOR_1 } from "../../constants";
import Button from "../utility-components/button/Button";

const AuthorInfo = ({ account }: { account: AccountParams }) => {
  return (
    <View style={root_container_style}>
      <Pressable>
        <Avatar url={account.profilePictureUri} />
      </Pressable>
      <Text style={marginStyle.margin_left_9} color={COLOR_1}>
        {account.username}
      </Text>
      <Button
        text={account.hasFollowedClient ? "following" : "follow"}
        style={marginStyle.margin_left_9}
        outlined
        outlineColor={COLOR_1}
        color={COLOR_1}
      />
    </View>
  );
};

const root_container_style = [
  layoutStyle.align_item_center,
  layoutStyle.flex_direction_row,
];

export default AuthorInfo;
