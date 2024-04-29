import { useGlobalSearchParams, useRouter } from "expo-router";
import Header from "../../../components/Header";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import { selectHashtagRouteParams } from "../../../store/hashtag/hashtag.selector";
import StackContainer from "../../../components/StackContainer";
import GridPostList from "../../../components/grid-post/GripPostList";
import { useCallback, useState } from "react";
import {
  fetchHashtagRoute,
  fetchHashtagTopPosts,
} from "../../../store/hashtag/hashtag.thunk";
import { View } from "react-native";
import { layoutStyle, marginStyle, paddingStyle } from "../../../styles";
import IconCircle from "../../../components/utility-components/icon/IconCircle";
import {
  COLOR_2,
  SIZE_15,
  SIZE_16,
  SIZE_70,
  SIZE_72,
  SIZE_84,
} from "../../../constants";
import Text from "../../../components/utility-components/text/Text";

const HashTagPage = () => {
  const { hashtag } = useGlobalSearchParams<{ hashtag: string }>();

  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const dispatch = useAppDispatch();

  const data = useAppSelector((state) =>
    selectHashtagRouteParams(state, hashtag!)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchHashtagTopPosts({ name: hashtag! }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [hashtag]);

  const onRefresh = useCallback(async () => {
    setError(false);
    setLoading(true);
    setRefreshing(true);
    dispatch(fetchHashtagRoute({ name: hashtag! }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, [hashtag]);

  const onPostPress = useCallback(
    (id: string, index: number) => {
      router.push({
        params: { hashtag },
        pathname: "/hashtag/hashtag/top_posts_scrollable_feed",
      });
    },
    [hashtag]
  );

  return (
    <StackContainer>
      <Header title={"#" + hashtag} />
      <GridPostList
        header={
          data && (
            <View
              style={[
                layoutStyle.align_item_center,
                paddingStyle.padding_vertical_12,
              ]}
            >
              <IconCircle
                name="hashtag"
                size={SIZE_70}
                outlineColor={COLOR_2}
                outlineWidth={2}
                scale={0.5}
              />
              <Text
                weight="semi-bold"
                size={SIZE_16}
                style={marginStyle.margin_top_12}
              >
                #{hashtag}
              </Text>
              <Text
                weight="semi-bold"
                color="grey"
                size={SIZE_16}
                style={marginStyle.margin_top_6}
              >
                {data.noOfPosts} posts
              </Text>
            </View>
          )
        }
        data={data?.topPosts.items}
        onPress={onPostPress}
        onEndReach={onEndReached}
        refreshing={refreshing}
        onRefresh={onRefresh}
        isError={isError}
        isLoading={isLoading}
        hasEndReached={data?.topPosts.hasEndReached}
      />
    </StackContainer>
  );
};

export default HashTagPage;
