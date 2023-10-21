import { useCallback } from "react";
import { useAccountAdapterParams } from "../../hooks/account.hooks";
import AppTouchableHighlight from "../AppTouchableHighlight";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import Avatar from "../Avatar";
import { COLOR_2, COLOR_5, SIZE_11, SIZE_24, SIZE_48 } from "../../constants";
import { StyleSheet, View } from "react-native";
import AppText from "../AppText";
import Icon from "../Icon";

export type OneToOneChatReceipientProps = {
  username: string;
  onSelect: (username: string) => void;
  selected: boolean;
};

export function OneToOneChatReceipient({
  username,
  onSelect,
  selected,
}: OneToOneChatReceipientProps) {
  const accountParams = useAccountAdapterParams(username, ["fullname"]);

  if (!accountParams) {
    return null;
  }

  const pressCallback = useCallback(() => {
    console.log("pressed");
    onSelect(username);
  }, [onSelect, username]);

  return (
    <AppTouchableHighlight
      style={styles.touchable_container}
      onPress={pressCallback}
    >
      <Avatar url={accountParams.profilePictureUrl} size={SIZE_48} />
      <View style={styles.name_container}>
        <AppText>{accountParams.username}</AppText>
        <AppText size={SIZE_11} color={COLOR_2}>
          {accountParams.fullname}
        </AppText>
      </View>
      {!selected ? (
        <Icon name="radio-unchecked" size={SIZE_24} color={COLOR_2} />
      ) : (
        <Icon name="tick-circle-solid" size={SIZE_24} color={COLOR_5} />
      )}
    </AppTouchableHighlight>
  );
}

const styles = StyleSheet.create({
  touchable_container: {
    ...paddingStyle.padding_horizontal_12,
    ...paddingStyle.padding_vertical_6,
    ...layoutStyle.align_item_center,
    ...layoutStyle.flex_direction_row,
  },
  name_container: {
    ...marginStyle.margin_horizontal_6,
    ...layoutStyle.flex_1,
  },
});
