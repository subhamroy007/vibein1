import { useLocalSearchParams } from "expo-router";
import AppScreen from "../../../components/AppScreen";
import Header from "../../../components/Header";
import { useLocationScreen } from "../../../hooks/utility.hooks";
import { useEffect } from "react";
import { View } from "react-native";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../../styles";
import GridPostList from "../../../components/grid-post/GripPostList";
import { SIZE_12, SIZE_120, SIZE_16, SIZE_18 } from "../../../constants";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import RetryableImage from "../../../components/RetryableImage";
import AppText from "../../../components/AppText";
import { formatNumber } from "../../../utility";

const offset_height = SIZE_120;

const LocationIndex = () => {
  const scrollOffset = useSharedValue(0);

  const { locationId } = useLocalSearchParams<{ locationId: string }>();

  const { fetch, screenInfo } = useLocationScreen(locationId!);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const metadataContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, offset_height],
            [0, -offset_height],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  }, []);

  return (
    <AppScreen>
      <Header title="Location" />
      {screenInfo?.data && (
        <View style={[layoutStyle.flex_1, { overflow: "hidden" }]}>
          <GridPostList
            onPress={(postId) => {
              // router.push({
              //   pathname: `hashtag/[hashtag]/classic_feed`,
              //   params: {
              //     hashtag,
              //     stringifiedPostList: JSON.stringify(hashtagPageInfo.posts),
              //   },
              // });
            }}
            onPreviewPress={(postId) => {
              // router.push({
              //   pathname: `hashtag/[hashtag]/swipable_feed`,
              //   params: {
              //     hashtag,
              //     stringifiedPostList: JSON.stringify(hashtagPageInfo.posts),
              //   },
              // });
            }}
            showViews
            data={screenInfo.data.posts}
            scrollOffset={scrollOffset}
            contentOffset={offset_height}
          />
          <Animated.View
            style={[
              {
                height: offset_height,
                backgroundColor: "white",
                position: "absolute",
                width: "100%",
              },
              metadataContainerAnimatedStyle,
              layoutStyle.align_item_center,
              layoutStyle.flex_direction_row,
              paddingStyle.padding_horizontal_12,
            ]}
          >
            <RetryableImage
              source={screenInfo.data.previewPhotoUrl}
              style={[
                backgroundStyle.background_color_7,
                { width: 90, height: 90, borderRadius: 12 },
              ]}
            />
            <View
              style={[
                layoutStyle.flex_1,
                layoutStyle.align_item_flex_start,
                marginStyle.margin_left_12,
              ]}
            >
              <AppText weight="bold" size={SIZE_18}>
                {screenInfo.data.name}
              </AppText>
              <AppText
                weight="bold"
                size={SIZE_16}
                style={marginStyle.margin_top_6}
              >
                {formatNumber(screenInfo.data.noOfPosts)} posts
              </AppText>
              <AppText
                weight="semi-bold"
                size={SIZE_12}
                style={marginStyle.margin_top_6}
              >
                {screenInfo.data.fullAddress}
              </AppText>
            </View>
          </Animated.View>
        </View>
      )}
    </AppScreen>
  );
};

export default LocationIndex;
