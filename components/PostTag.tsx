import { ScrollView, View } from "react-native";
import { layoutStyle, marginStyle, paddingStyle } from "../styles";
import AppText from "./AppText";
import SolidButton from "./SolidButton";
import {
  COLOR_2,
  HEIGHT_SCALE_1,
  SIZE_11,
  SIZE_30,
  SIZE_54,
  SIZE_6,
} from "../constants";
import useAccountParams from "../hooks/accountHook";
import Avatar from "./Avatar";
import AppTouchableHighlight from "./AppTouchableHighlight";

export default function PostTaggedAccount({ id }: { id: string }) {
  const { accountParams, toggleAccountFollowingStateCallback } =
    useAccountParams(id, [
      "fullname",
      "has-requested-to-follow",
      "is-following",
      "is-private",
    ]);

  if (!accountParams) {
    return null;
  }
  const {
    profilePictureUrl,
    username,
    fullname,
    hasRequestedToFollow,
    isFollowing,
  } = accountParams;

  return (
    <AppTouchableHighlight
      onPress={() => {}}
      style={[
        paddingStyle.padding_horizontal_12,
        paddingStyle.padding_vertical_6,
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
      ]}
    >
      <Avatar url={profilePictureUrl} size={SIZE_54} />
      <View
        style={[
          layoutStyle.align_item_flex_start,
          marginStyle.margin_horizontal_6,
          layoutStyle.flex_2,
        ]}
      >
        <AppText numberOfLines={1}>{username}</AppText>
        <AppText numberOfLines={1} color={COLOR_2} size={SIZE_11}>
          {fullname}
        </AppText>
      </View>
      <SolidButton
        onPress={toggleAccountFollowingStateCallback}
        title={
          isFollowing
            ? "following"
            : hasRequestedToFollow
            ? "requested"
            : "follow"
        }
        style={[layoutStyle.flex_1]}
      />
    </AppTouchableHighlight>
  );
}

export type PostTagProps = {
  accounts: string[];
};

export function PostTag({ accounts }: PostTagProps) {
  const containerHeight = Math.min(
    (SIZE_6 * 2 + SIZE_54) * accounts.length + SIZE_6 * 2,
    HEIGHT_SCALE_1
  );
  return (
    <View style={{ height: containerHeight }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={paddingStyle.padding_vertical_6}
      >
        {accounts.map((account) => (
          <PostTaggedAccount id={account} key={account} />
        ))}
      </ScrollView>
    </View>
  );
}
