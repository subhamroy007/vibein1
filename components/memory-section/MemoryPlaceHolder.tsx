import { View } from "react-native";
import { AccountSelectorParams } from "../../types/selector.types";
import {
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import {
  COLOR_1,
  GREY_1,
  SIZE_12,
  SIZE_30,
  SIZE_54,
  SIZE_60,
} from "../../constants";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import Ring from "../Ring";
import PressableIcon from "../utility-components/button/PressableIcon";

export type MemoryPlaceHolderProps = {
  account: AccountSelectorParams;
  isLoading: boolean;
  isError: boolean;
  callback: () => void;
  height: number;
  useMaxHeight: boolean;
};

export default function MemoryPlaceHolder({
  account,
  callback,
  isError,
  isLoading,
  height,
  useMaxHeight,
}: MemoryPlaceHolderProps) {
  return (
    <>
      <View
        style={[
          layoutStyle.position_absolute,
          layoutStyle.width_100_percent,
          layoutStyle.align_item_center,
          layoutStyle.flex_direction_row,
          paddingStyle.padding_horizontal_12,
          { top: SIZE_12 },
        ]}
      >
        <Avatar size={SIZE_30} url={account.profilePictureUri} />
        <Text
          weight="semi-bold"
          color={COLOR_1}
          style={marginStyle.margin_left_12}
        >
          {account.userId}
        </Text>
      </View>
      <View
        style={[
          {
            height,
            top: useMaxHeight ? SIZE_54 : 0,
            backgroundColor: GREY_1,
          },
          borderStyle.border_radius_12,
          layoutStyle.content_center,
        ]}
      >
        {isError ? (
          <PressableIcon
            name={"retry"}
            color={COLOR_1}
            size={SIZE_60}
            onPress={callback}
          />
        ) : isLoading ? (
          <Ring />
        ) : undefined}
      </View>
    </>
  );
}
