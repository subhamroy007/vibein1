import { useGlobalSearchParams, useRouter } from "expo-router";
import AppScreen from "../../../components/AppScreen";
import useHashtag from "../../../hooks/hashtag.hook";
import { useEffect } from "react";
import GridPostList from "../../../components/grid-post/GripPostList";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SIZE_120, SIZE_16 } from "../../../constants";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../../styles";
import { View } from "react-native";
import AppText from "../../../components/AppText";
import { formatNumber } from "../../../utility";
import Header from "../../../components/Header";
import RetryableImage from "../../../components/RetryableImage";
import Button from "../../../components/Button";

const offset_height = SIZE_120;

const HashTagPage = () => {
  const { hashtag } = useGlobalSearchParams<{ hashtag: string }>();

  const router = useRouter();

  const scrollOffset = useSharedValue(0);

  const { fetch, hashtagPageInfo, requestInfo } = useHashtag(hashtag!);

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

  useEffect(() => {
    fetch();
  }, []);

  return (
    <AppScreen>
      <Header title={"#" + hashtag} />
      {hashtagPageInfo && (
        <View style={[layoutStyle.flex_1, { overflow: "hidden" }]}>
          <GridPostList
            onPress={(postId) => {
              router.push({
                pathname: `hashtag/[hashtag]/classic_feed`,
                params: {
                  hashtag,
                  stringifiedPostList: JSON.stringify(hashtagPageInfo.posts),
                },
              });
            }}
            onPreviewPress={(postId) => {
              router.push({
                pathname: `hashtag/[hashtag]/swipable_feed`,
                params: {
                  hashtag,
                  stringifiedPostList: JSON.stringify(hashtagPageInfo.posts),
                },
              });
            }}
            showViews
            data={hashtagPageInfo.posts}
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
              source={hashtagPageInfo.previewUrl}
              style={[
                backgroundStyle.background_color_7,
                { width: 90, height: 90, borderRadius: 12 },
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
                {formatNumber(hashtagPageInfo.noOfPosts)} posts
              </AppText>
              <Button
                title="follow"
                width={90}
                style={marginStyle.margin_top_9}
              />
            </View>
          </Animated.View>
        </View>
      )}
    </AppScreen>
  );
};

export default HashTagPage;
