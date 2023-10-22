import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import AppText from "./AppText";
import Icon from "./Icon";
import HighlightedText from "./HighlightedText";
import Animated, {
  Easing,
  runOnJS,
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
import Album from "./Album/Album";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSpringAnimation } from "../hooks/animation.hooks";

export type PostProps = {
  id: string;
  onPress: (id: string) => void;
};

export default function ClassicPost({ id, onPress }: PostProps) {
  const {
    postParams,
    togglePostLikeStateCallback,
    togglePostSaveStateCallback,
  } = usePost(id);

  const { width: screenWidth } = useWindowDimensions();

  const [isTagPortalOpen, setTagPortalOpen] = useState(false);

  const toggleTagPortalOpen = useCallback(
    () => setTagPortalOpen((prevState) => !prevState),
    []
  );

  const {
    animatedStyle: animatedHeartIconStyle,
    startAnimation: startHeartIconAnimation,
  } = useSpringAnimation();

  const doubleTapCallback = useCallback(() => {
    startHeartIconAnimation();
    if (!postParams?.isLiked) {
      togglePostLikeStateCallback();
    }
  }, [
    postParams?.isLiked,
    togglePostLikeStateCallback,
    startHeartIconAnimation,
  ]);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      runOnJS(doubleTapCallback)();
    });

  const singleTapCallback = useCallback(() => {
    onPress(id);
  }, [id, onPress]);

  const singleTapGesture = Gesture.Tap().onStart(() => {
    runOnJS(singleTapCallback)();
  });

  const complexGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

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

  const [isCaptionCollapsed, setCaptionCollapsedState] = useState(true);

  const toggleCaptionCollapsedState = useCallback(
    () => setCaptionCollapsedState((prevState) => !prevState),
    []
  );

  const copyToPressCallback = useCallback(() => {}, []);

  const shareToPressCallback = useCallback(() => {}, []);

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
          { width: screenWidth, aspectRatio: "3/4" },
        ]}
      >
        <GestureDetector gesture={complexGesture}>
          <Album photos={photos} containerAspectRatio={"3/4"} type="light" />
        </GestureDetector>
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
          <HighlightedText
            style={marginStyle.margin_bottom_3}
            collapsed={isCaptionCollapsed}
            onPress={toggleCaptionCollapsedState}
          >
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
                  icon={"pin-solid"}
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
