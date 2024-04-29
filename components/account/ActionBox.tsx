import { View } from "react-native";
import {
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Icon from "../utility-components/icon/Icon";
import Text from "../utility-components/text/Text";
import { SIZE_15 } from "../../constants";
import Button from "../utility-components/button/Button";

export type ActionBoxProps = {
  isRequestedToFollow: boolean;
  isBlocked: boolean;
  onRequest: () => void;
  onUnblock: () => void;
};

export default function ActionBox({
  isBlocked,
  isRequestedToFollow,
  onUnblock,
  onRequest,
}: ActionBoxProps) {
  return (
    <View style={root_container_style}>
      <Icon name={isBlocked ? "block" : "account-circle-outline"} />
      <Text style={marginStyle.margin_top_6} weight="semi-bold" size={SIZE_15}>
        {isBlocked ? "This account is blocked" : "This account is private"}
      </Text>
      <Text numberOfLines={0} style={marginStyle.margin_top_6} color="grey">
        {isBlocked
          ? "unblock the account to see their photos and videos"
          : `you can send a follow request to this account and if they accept it you will be able to see their photos and videos`}
      </Text>
      {isBlocked ? (
        <Button
          text={"unblock"}
          width={"100%"}
          style={marginStyle.margin_top_12}
          onPress={onUnblock}
        />
      ) : (
        <Button
          text={isRequestedToFollow ? "request sent" : "follow"}
          width={"100%"}
          onPress={onRequest}
          style={marginStyle.margin_top_12}
        />
      )}
    </View>
  );
}

const root_container_style = [
  layoutStyle.align_item_center,
  paddingStyle.padding_12,
  borderStyle.border_color_2,
  borderStyle.border_top_width_hairline,
];
