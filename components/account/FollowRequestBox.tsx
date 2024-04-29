import { View } from "react-native";
import {
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Text from "../utility-components/text/Text";
import { SIZE_15, VERMILION_RED } from "../../constants";
import Button from "../utility-components/button/Button";

export type FollowRequestBoxProps = {
  userId: string;
  onAccept: () => void;
  onReject: () => void;
};

export default function FollowRequestBox({
  userId,
  onAccept,
  onReject,
}: FollowRequestBoxProps) {
  return (
    <View style={root_container_style}>
      <Text weight="semi-bold" size={SIZE_15}>
        {userId} sent you a follow request
      </Text>
      <View style={button_container_style}>
        <Button text={"accept"} stretch={1} onPress={onAccept} />
        <Button
          text={"delete"}
          stretch={1}
          style={marginStyle.margin_left_12}
          backgroundColor={VERMILION_RED}
          onPress={onReject}
        />
      </View>
    </View>
  );
}

const root_container_style = [
  layoutStyle.align_item_center,
  paddingStyle.padding_vertical_18,
  paddingStyle.padding_horizontal_12,
  borderStyle.border_bottom_width_hairline,
  borderStyle.border_color_2,
];

const button_container_style = [
  layoutStyle.flex_direction_row,
  marginStyle.margin_top_18,
  layoutStyle.align_self_stretch,
];
