import { useGlobalSearchParams } from "expo-router";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import GridPostList from "../../../components/grid-post/GripPostList";
import {
  useHashtag,
  useHashtagGeneralRoute,
  useHashtagGeneralRouteInit,
} from "../../../hooks/hashtag.hook";
import { useAppSelector } from "../../../hooks/storeHooks";
import { selectHashtagAdapterParams } from "../../../store/hashtag/hashtag.selector";
import { View } from "react-native";
import { SIZE_16, SIZE_90 } from "../../../constants";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../../styles";
import RetryableImage from "../../../components/RetryableImage";
import AppText from "../../../components/AppText";
import { formatNumber } from "../../../utility";
import Button from "../../../components/Button";

export const HashtagMeta = ({ hashtag }: { hashtag: string }) => {
  const { hashtagParams, toggleHashtagFollowCallback } = useHashtag(hashtag);

  if (!hashtagParams) {
    return null;
  }

  return (
    <View
      style={[
        layoutStyle.align_item_center,
        layoutStyle.flex_direction_row,
        paddingStyle.padding_horizontal_12,
        paddingStyle.padding_vertical_18,
      ]}
    >
      <RetryableImage
        source={hashtagParams.previewUrl}
        style={[
          backgroundStyle.background_color_7,
          { width: SIZE_90, height: SIZE_90 },
          borderStyle.border_radius_12,
        ]}
      />
      <View
        style={[
          layoutStyle.flex_1,
          layoutStyle.align_item_center,
          marginStyle.margin_left_12,
        ]}
      >
        <AppText weight="bold" size={SIZE_16}>
          {formatNumber(hashtagParams.noOfPosts)} posts
        </AppText>
        <Button
          title={hashtagParams.isFollowing ? "following" : "follow"}
          width={90}
          style={marginStyle.margin_top_9}
          onPress={toggleHashtagFollowCallback}
        />
      </View>
    </View>
  );
};

const HashTagPage = () => {
  const { hashtag } = useGlobalSearchParams<{ hashtag: string }>();

  const routeId = useHashtagGeneralRouteInit(hashtag!);

  const { fetchGeneralInfo, fetchTopPosts, routeParams } =
    useHashtagGeneralRoute(routeId, hashtag!);
  console.log(routeId, hashtag);
  return (
    <AppScreen>
      <Header title={"#" + hashtag} />
      {routeParams && (
        <GridPostList
          header={
            routeParams.data?.posts.length ? (
              <HashtagMeta hashtag={hashtag!} />
            ) : undefined
          }
          enablePagination={!routeParams.data?.hasEndReached}
          data={routeParams.data?.posts}
          initRequest={fetchGeneralInfo}
          paginationRequest={fetchTopPosts}
          showPlaceHolder
          state={routeParams.state}
          enableReresh
          gridPressRoute={{
            pathname: "/hashtag/[hashtag]/top_posts_scrollable_feed",
            params: { routeId, hashtag },
          }}
          previewPressRoute={{
            pathname: "/hashtag/[hashtag]/top_posts_swipable_feed",
            params: { routeId, hashtag },
          }}
        />
      )}
    </AppScreen>
  );
};

export default HashTagPage;
