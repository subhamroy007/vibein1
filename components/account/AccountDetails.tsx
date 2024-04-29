import { Pressable, View } from "react-native";
import { AccountSelectorParams } from "../../types/selector.types";
import {
  layoutStyle,
  marginStyle,
  paddingStyle,
  text_style,
} from "../../styles";
import Text from "../utility-components/text/Text";
import { SIZE_14, SIZE_15, SIZE_90 } from "../../constants";
import MultilineText from "../utility-components/text/MultilineText";
import { formatNumber } from "../../utility";
import Button from "../utility-components/button/Button";
import OutlinedAvatar from "../utility-components/OutlinedAvatar";
import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function AccountDetails({
  account,
}: {
  account: AccountSelectorParams;
}) {
  const router = useRouter();

  const onPress = useCallback(() => {
    router.push({
      pathname: "/profile/userid/related_accounts",
      params: { userid: account.username },
    });
  }, []);

  return (
    <View style={root_container_style}>
      <OutlinedAvatar url={account.profilePictureUri} size={SIZE_90} />
      <Text weight="bold" size={SIZE_14} style={marginStyle.margin_top_12}>
        {account.fullname}
      </Text>
      {account.bio !== undefined && (
        <MultilineText style={bio_style} text={account.bio} />
      )}
      <View style={metadata_container_style}>
        <View style={metadata_item_style}>
          <Text weight="bold" size={SIZE_15}>
            {account.noOfPosts}
          </Text>
          <Text weight="bold" size={SIZE_15}>
            {" "}
            post
          </Text>
        </View>
        <Pressable onPress={onPress} style={metadata_item_style}>
          <Text weight="bold" size={SIZE_15}>
            {account.noOfFollowings}
          </Text>
          <Text weight="bold" size={SIZE_15}>
            {" "}
            following
          </Text>
        </Pressable>

        <View style={metadata_item_style}>
          <Text weight="bold" size={SIZE_15}>
            {formatNumber(account.noOfFollowers!)}
          </Text>
          <Text weight="bold" size={SIZE_15}>
            {" "}
            followers
          </Text>
        </View>
      </View>
      {!account.isBlocked && !(account.isPrivate && !account.isFollowed) && (
        <View style={buttons_container_style}>
          <Button
            text={
              account.isFollowed
                ? "following"
                : account.hasFollowedClient
                ? "follow back"
                : "follow"
            }
            stretch={1}
          />
          <Button
            text="message"
            stretch={1}
            outlined
            style={marginStyle.margin_left_12}
          />
        </View>
      )}
    </View>
  );
}

const root_container_style = [
  paddingStyle.padding_horizontal_12,
  paddingStyle.padding_vertical_18,
  layoutStyle.align_item_center,
];

const bio_style = [marginStyle.margin_top_12, text_style.text_align_center];

const metadata_container_style = [
  layoutStyle.flex_direction_row,
  layoutStyle.justify_content_space_between,
  marginStyle.margin_top_12,
  layoutStyle.align_self_stretch,
];

const metadata_item_style = [
  layoutStyle.align_item_center,
  layoutStyle.justify_content_center,
  layoutStyle.flex_1,
];

const buttons_container_style = [
  layoutStyle.align_self_stretch,
  layoutStyle.flex_direction_row,
  marginStyle.margin_top_18,
];
