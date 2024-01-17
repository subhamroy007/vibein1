import { useAccountHomeRoute } from "../../hooks/account.hooks";
import GridPostList from "../grid-post/GripPostList";
import { View } from "react-native";
import useAccountParams from "../../hooks/accountHook";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import AppText from "../AppText";
import { formatNumber } from "../../utility";
import { SIZE_14, SIZE_16, SIZE_90 } from "../../constants";
import Avatar from "../Avatar";
import Button from "../Button";
import HighlightedText from "../HighlightedText";

const AccountMetadata = ({ username }: { username: string }) => {
  const { accountParams, toggleAccountFollowingStateCallback } =
    useAccountParams(username);

  if (!accountParams) {
    return null;
  }

  return (
    <View
      style={[
        paddingStyle.padding_horizontal_12,
        paddingStyle.padding_vertical_18,
        layoutStyle.align_item_center,
      ]}
    >
      <Avatar url={accountParams.profilePictureUrl} size={SIZE_90} />
      <AppText weight="bold" size={SIZE_14} style={marginStyle.margin_top_12}>
        {accountParams.fullname}
      </AppText>
      <HighlightedText
        style={[marginStyle.margin_top_12, { textAlign: "center" }]}
      >
        {accountParams.bio!}
      </HighlightedText>
      <View
        style={[
          layoutStyle.align_item_center,
          layoutStyle.flex_direction_row,
          layoutStyle.justify_content_space_between,
          layoutStyle.align_self_stretch,
          marginStyle.margin_top_18,
          paddingStyle.padding_horizontal_6,
        ]}
      >
        <View
          style={[
            layoutStyle.align_item_center,
            layoutStyle.justify_content_center,
            { flex: 3 },
          ]}
        >
          <AppText weight="bold" size={SIZE_16}>
            {accountParams.noOfPosts}
          </AppText>
          <AppText weight="bold" size={SIZE_16}>
            {" "}
            post
          </AppText>
        </View>
        <View
          style={[
            layoutStyle.align_item_center,
            layoutStyle.justify_content_center,
            { flex: 5 },
          ]}
        >
          <AppText weight="bold" size={SIZE_16}>
            {accountParams.noOfFollowings}
          </AppText>
          <AppText weight="bold" size={SIZE_16}>
            {" "}
            following
          </AppText>
        </View>

        <View
          style={[
            layoutStyle.align_item_center,
            layoutStyle.justify_content_center,
            { flex: 3 },
          ]}
        >
          <AppText weight="bold" size={SIZE_16}>
            {formatNumber(accountParams.noOfFollowers!)}
          </AppText>
          <AppText weight="bold" size={SIZE_16}>
            {" "}
            followers
          </AppText>
        </View>
      </View>
      <View
        style={[
          layoutStyle.align_self_stretch,
          layoutStyle.flex_direction_row,
          layoutStyle.justify_content_space_between,
          marginStyle.margin_top_18,
        ]}
      >
        <Button
          title={accountParams.isFollowing ? "following" : "follow"}
          width={48}
          onPress={toggleAccountFollowingStateCallback}
        />
        <Button title="message" width={48} hideBackground />
      </View>
    </View>
  );
};

const AccountHomeTab = ({
  username,
  routeId,
}: {
  username: string;
  routeId: string;
}) => {
  const { routeParams, fetch, fetchPosts } = useAccountHomeRoute(
    username,
    routeId
  );

  if (!routeParams) {
    return null;
  }

  return (
    <GridPostList
      data={routeParams.data.allPosts.posts}
      showPin
      enableReresh
      initRequest={fetch}
      paginationRequest={fetchPosts}
      state={routeParams.state}
      header={
        routeParams.data.allPosts.posts.length ? (
          <AccountMetadata username={username} />
        ) : undefined
      }
      enablePagination={!routeParams.data.allPosts.hasEndReached}
      gridPressRoute={{
        params: { routeId, username },
        pathname: "/account/[username]/all_post_scrollable_feed",
      }}
    />
  );
};

export default AccountHomeTab;
