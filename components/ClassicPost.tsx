import { Pressable, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import Icon from "./Icon";
import HighlightedText from "./HighlightedText";
import Album from "./Album";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import AppPressable from "./AppPressable";
import { layoutStyle, marginStyle, paddingStyle } from "../styles";
import { useCallback, useState } from "react";
import {
  COLOR_6,
  SIZE_42,
  SIZE_11,
  SIZE_14,
  SIZE_24,
  SIZE_30,
  COLOR_9,
  SIZE_20,
  SIZE_36,
  SIZE_27,
} from "../constants";
import SwipeUpPortal from "./SwipeUpPortal";
import { PostTag } from "./PostTag";
import usePost from "../hooks/postHook";
import { useAppSelector } from "../hooks/storeHooks";
import { selectClientAccountParams } from "../store/client/client.selector";
import Option from "./Option";
import Avatar from "./Avatar";
import CircleSolidIcon from "./CircleSolidIcon";
import CommentSection from "./CommentSection";
import PostSendSection from "./post_send_section/PostSendSection";

export type PostProps = {
  id: string;
};

export default function ClassicPost({ id }: PostProps) {
  const {
    postParams,
    togglePostLikeStateCallback,
    togglePostSaveStateCallback,
  } = usePost(id);
  const animatedValue = useSharedValue(1);

  const [isTagPortalOpen, setTagPortalOpen] = useState(false);

  const toggleTagPortalOpen = useCallback(
    () => setTagPortalOpen((prevState) => !prevState),
    []
  );

  const animatedHeartIconStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value === 1 ? 0 : 1,
      transform: [
        {
          scale: animatedValue.value,
        },
      ],
      position: "absolute",
    };
  });

  const onDoubleTapCallback = useCallback(() => {
    if (!postParams?.isLiked) {
      togglePostLikeStateCallback();
    }

    animatedValue.value = withSequence(
      withTiming(1, {
        duration: 50,
        easing: Easing.ease,
      }),
      withTiming(2, {
        duration: 400,
        easing: Easing.elastic(2.5),
      }),
      withDelay(
        800,
        withTiming(1, {
          duration: 100,
          easing: Easing.ease,
        })
      )
    );
  }, [postParams?.isLiked, togglePostLikeStateCallback]);

  const [isMoreOptionPortalOpen, setMoreOptionPortalState] = useState(false);

  const toggleMoreOptionPortalCallback = useCallback(
    () => setMoreOptionPortalState((prevState) => !prevState),
    [setMoreOptionPortalState]
  );

  const [isCommentSectionPortalOpen, setCommentSectionPortalState] =
    useState(false);

  const toggleCommentSectionPortalCallback = useCallback(
    () => setCommentSectionPortalState((prevState) => !prevState),
    [setCommentSectionPortalState]
  );

  const [isSendSectionPortalOpen, setSendSectionPortalState] = useState(false);

  const toggleSendSectionPortalCallback = useCallback(
    () => setSendSectionPortalState((prevState) => !prevState),
    [setSendSectionPortalState]
  );

  const clientAccountParams = useAppSelector((state) =>
    selectClientAccountParams(state)
  );

  const copyToPressCallback = useCallback(() => {}, []);

  const shareToPressCallback = useCallback(() => {}, []);

  const sendToPressCallback = useCallback(() => {}, []);

  const addToMemoryPressCallback = useCallback(() => {}, []);

  const reportPressCallback = useCallback(() => {}, []);

  const deletePressCallback = useCallback(() => {}, []);

  const pinPressCallback = useCallback(() => {}, []);

  const advancedOptionsPressPressCallback = useCallback(() => {}, []);

  const updatePressCallback = useCallback(() => {}, []);

  if (!postParams || !clientAccountParams) {
    return null;
  }

  const {
    createdAt,
    createdBy,
    engagementSummary,
    isLiked,
    isSaved,
    photos,
    caption,
    taggedAccounts,
    taggedLocation,
    advancedOptions,
    isPinned,
  } = postParams;

  return (
    <Animated.View>
      <View
        style={[
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_vertical_6,
          paddingStyle.padding_horizontal_9,
        ]}
      >
        <Avatar url={createdBy.profilePictureUrl} size={SIZE_30} />
        <View
          style={[
            layoutStyle.align_item_flex_start,
            marginStyle.margin_horizontal_6,
            layoutStyle.flex_1,
          ]}
        >
          <AppText weight="medium" numberOfLines={1}>
            {createdBy.username}
          </AppText>
          {taggedLocation && (
            <AppText size={SIZE_11} weight="medium" numberOfLines={1}>
              {taggedLocation.name}
            </AppText>
          )}
        </View>

        <Pressable onPress={toggleMoreOptionPortalCallback} hitSlop={SIZE_24}>
          <Icon name="more-horiz" size={SIZE_24} />
        </Pressable>
      </View>
      <View
        style={[
          layoutStyle.align_item_center,
          layoutStyle.justify_content_center,
        ]}
      >
        <Album photos={photos} onDoubleTap={onDoubleTapCallback} />
        <Animated.View style={animatedHeartIconStyle}>
          <Icon name="heart-solid" size={SIZE_42} color={COLOR_6} />
        </Animated.View>
        {taggedAccounts && (
          <Pressable
            onPress={toggleTagPortalOpen}
            style={[styles.tag_icon, layoutStyle.position_absolute]}
            hitSlop={SIZE_36}
          >
            <CircleSolidIcon
              iconName="tag-solid"
              size={SIZE_20}
              color={COLOR_9}
            />
          </Pressable>
        )}
      </View>
      <View
        style={[
          layoutStyle.align_item_center,
          layoutStyle.justify_content_space_around,
          layoutStyle.flex_direction_row,
          paddingStyle.padding_top_9,
          paddingStyle.padding_bottom_6,
          paddingStyle.padding_horizontal_12,
        ]}
      >
        <AppPressable onPress={togglePostLikeStateCallback} hitSlop={SIZE_24}>
          <Icon
            name={isLiked ? "heart-solid" : "heart-outline"}
            size={SIZE_27}
            color={isLiked ? COLOR_6 : undefined}
          />
        </AppPressable>
        <Pressable
          hitSlop={SIZE_24}
          onPress={toggleCommentSectionPortalCallback}
        >
          <Icon name="comment" size={SIZE_27} />
        </Pressable>
        <Pressable hitSlop={SIZE_24} onPress={toggleSendSectionPortalCallback}>
          <Icon name="send-outline" size={SIZE_27} />
        </Pressable>
        <AppPressable onPress={togglePostSaveStateCallback} hitSlop={SIZE_24}>
          <Icon
            name={isSaved ? "bookmark-solid" : "bookmark-outline"}
            size={SIZE_27}
          />
        </AppPressable>
      </View>
      <View
        style={[
          paddingStyle.padding_horizontal_12,
          paddingStyle.padding_bottom_12,
        ]}
      >
        {(engagementSummary.noOfLikes > 0 || engagementSummary.noOfViews > 0) &&
          !advancedOptions.hideEngagementCount && (
            <View
              style={[
                layoutStyle.align_item_center,
                layoutStyle.flex_direction_row,
                marginStyle.margin_bottom_3,
              ]}
            >
              {engagementSummary.noOfViews > 0 && (
                <AppText weight="medium" style={marginStyle.margin_right_6}>
                  {engagementSummary.noOfViews} views
                </AppText>
              )}
              {engagementSummary.noOfLikes > 0 && (
                <AppText weight="medium">
                  {engagementSummary.noOfLikes} likes
                </AppText>
              )}
            </View>
          )}
        {caption && (
          <HighlightedText style={marginStyle.margin_bottom_3}>
            {caption}
          </HighlightedText>
        )}
        {engagementSummary.noOfComments !== 0 &&
          advancedOptions.commentSetting !== "disabled" && (
            <AppText weight="bold">
              See all {engagementSummary.noOfComments} comments
            </AppText>
          )}
      </View>
      {taggedAccounts && isTagPortalOpen && (
        <SwipeUpPortal onDismiss={toggleTagPortalOpen} title="In This Post">
          <PostTag accounts={taggedAccounts} />
        </SwipeUpPortal>
      )}
      {isMoreOptionPortalOpen && (
        <SwipeUpPortal
          onDismiss={toggleMoreOptionPortalCallback}
          title="Options"
        >
          <View>
            <Option
              icon="link"
              text="Copy Link"
              onPress={copyToPressCallback}
            />
            <Option
              icon="share"
              text="Share To"
              onPress={shareToPressCallback}
            />
            {!advancedOptions.disableCirculation && (
              <Option
                icon="circulate"
                text="Circulate To Memory"
                onPress={addToMemoryPressCallback}
              />
            )}
            {clientAccountParams._id === createdBy._id ? (
              <>
                <Option
                  icon="explore"
                  text="Advanced Options"
                  onPress={advancedOptionsPressPressCallback}
                />

                <Option icon="edit" onPress={updatePressCallback} text="Edit" />

                <Option
                  icon={isPinned ? "pin-solid" : "pin-outline"}
                  text={isPinned ? "Unpin" : "Pin"}
                  onPress={pinPressCallback}
                />

                <Option
                  icon="delete"
                  text="Delete"
                  color="red"
                  onPress={deletePressCallback}
                />
              </>
            ) : (
              <Option
                icon="report"
                text="Report"
                color="red"
                onPress={reportPressCallback}
              />
            )}
          </View>
        </SwipeUpPortal>
      )}
      {isCommentSectionPortalOpen && (
        <SwipeUpPortal
          onDismiss={toggleCommentSectionPortalCallback}
          title="Comments"
          useFullScreen
          useBreakPoint
        >
          <CommentSection id={id} />
        </SwipeUpPortal>
      )}
      {isSendSectionPortalOpen && (
        <SwipeUpPortal
          onDismiss={toggleSendSectionPortalCallback}
          title="Send To"
          useFullScreen
          useBreakPoint
        >
          <PostSendSection />
        </SwipeUpPortal>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tag_icon: { bottom: SIZE_14, left: SIZE_14 },
});
