import { useGlobalSearchParams, useRouter } from "expo-router";
import Header from "../../../components/Header";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks";
import StackContainer from "../../../components/StackContainer";
import GridPostList from "../../../components/grid-post/GripPostList";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { layoutStyle, marginStyle, paddingStyle } from "../../../styles";
import IconCircle from "../../../components/utility-components/icon/IconCircle";
import {
  COLOR_2,
  SIZE_15,
  SIZE_16,
  SIZE_70,
  SIZE_72,
} from "../../../constants";
import Text from "../../../components/utility-components/text/Text";
import { selectLocationRouteParams } from "../../../store/location/location.selector";
import {
  fetchLocationRoute,
  fetchLocationTopPosts,
} from "../../../store/location/location.thunk";
import { formatNumber } from "../../../utility";

const LocationPage = () => {
  const { location_id } = useGlobalSearchParams<{ location_id: string }>();

  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const dispatch = useAppDispatch();

  const data = useAppSelector((state) =>
    selectLocationRouteParams(state, location_id!)
  );

  const onEndReached = useCallback(async () => {
    setError(false);
    setLoading(true);
    dispatch(fetchLocationTopPosts({ location_id: location_id! }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location_id]);

  const onRefresh = useCallback(async () => {
    setError(false);
    setLoading(true);
    setRefreshing(true);
    dispatch(fetchLocationRoute({ location_id: location_id! }))
      .unwrap()
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, [location_id]);

  const onPostPress = useCallback(
    (id: string, index: number) => {
      router.push({
        params: { location_id, index },
        pathname: "/location/location_id/top_posts_scrollable_feed",
      });
    },
    [location_id]
  );

  return (
    <StackContainer>
      <Header title={"location"} />
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
                name="location-outline"
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
                {data.name}
              </Text>
              <Text
                color="grey"
                size={SIZE_15}
                style={marginStyle.margin_top_6}
              >
                {formatNumber(data.noOfPosts)} posts
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

export default LocationPage;
