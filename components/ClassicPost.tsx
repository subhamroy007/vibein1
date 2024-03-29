import { Pressable, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import Icon from "./Icon";
import HighlightedText from "./HighlightedText";
import Animated from "react-native-reanimated";
import AppPressable from "./AppPressable";
import { borderStyle, layoutStyle, marginStyle, paddingStyle } from "../styles";
import { useCallback, useState } from "react";
import {
  COLOR_6,
  SIZE_42,
  SIZE_11,
  SIZE_14,
  SIZE_24,
  SIZE_30,
  SIZE_27,
  COLOR_2,
} from "../constants";
import SwipeUpPortal from "./SwipeUpPortal";
import { PostTag } from "./PostTag";
import usePost from "../hooks/postHook";
import { useAppSelector } from "../hooks/storeHooks";
import { selectClientAccountParams } from "../store/client/client.selector";
import Option from "./Option";
import Avatar from "./Avatar";
import CommentSection from "./CommentSection";
import PostSendSection from "./post_send_section/PostSendSection";
import Album from "./Album/Album";
import ClassicPostVideoPlayer from "./ClassicPostVideoPlayer";
import { Href } from "expo-router/build/link/href";
import { useRouter } from "expo-router";

export type PostProps = {
  id: string;
  focused: boolean;
  pressRoute?: Href;
  index: number;
};

export default function ClassicPost({
  id,
  pressRoute,
  focused,
  index,
}: PostProps) {
  const { postParams, togglePostLikeStateCallback } = usePost(id);

  const router = useRouter();

  const [isTagPortalOpen, setTagPortalOpen] = useState(false);

  const toggleTagPortalOpen = useCallback(
    () => setTagPortalOpen((prevState) => !prevState),
    []
  );

  const doubleTapCallback = useCallback(() => {
    if (!postParams?.isLiked) {
      togglePostLikeStateCallback();
    }
  }, [postParams?.isLiked, togglePostLikeStateCallback]);

  const singleTapCallback = useCallback(() => {
    if (pressRoute) {
      if (typeof pressRoute === "string") {
        router.push({
          pathname: pressRoute,
          params: { selectedPostIndex: index },
        });
      } else {
        router.push({
          pathname: pressRoute?.pathname,
          params: { ...pressRoute?.params, selectedPostIndex: index },
        });
      }
    }
  }, [pressRoute, router, index]);

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

  const gotoProifile = useCallback(() => {
    router.push({
      pathname: "/account/[username]",
      params: { username: postParams?.createdBy.username },
    });
  }, [router, postParams]);

  if (!postParams || !clientAccountParams) {
    return null;
  }

  const {
    createdAt,
    createdBy,
    engagementSummary,
    isLiked,
    isSaved,
    caption,
    taggedAccounts,
    taggedLocation,
    advancedOptions,
    isPinned,
    ...restParams
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
        <Pressable onPress={gotoProifile}>
          <Avatar url={createdBy.profilePictureUri} size={SIZE_30} />
        </Pressable>
        <View
          style={[
            layoutStyle.align_item_flex_start,
            marginStyle.margin_horizontal_6,
            layoutStyle.flex_1,
          ]}
        >
          <AppText weight="bold" numberOfLines={1} onPress={gotoProifile}>
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
      {restParams.postType === "photo" && (
        <Album
          photos={restParams.photos}
          onTap={singleTapCallback}
          onDoubleTap={doubleTapCallback}
        />
      )}
      {restParams.postType === "moment" && (
        <ClassicPostVideoPlayer
          focused={focused}
          onDoubleTap={doubleTapCallback}
          onTap={singleTapCallback}
          video={restParams.video}
        />
      )}
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
        <View
          style={[
            styles.comment_box,
            layoutStyle.align_item_center,
            layoutStyle.flex_direction_row,
            layoutStyle.justify_content_center,
          ]}
        >
          <Avatar size={SIZE_24} url={clientAccountParams.profilePictureUri} />
          <AppText
            color={COLOR_2}
            weight="regular"
            style={marginStyle.margin_left_6}
          >
            write a comment
          </AppText>
        </View>
        <Pressable hitSlop={SIZE_24} onPress={toggleSendSectionPortalCallback}>
          <Icon name="send-outline" size={SIZE_27} />
        </Pressable>
      </View>
      <View
        style={[
          paddingStyle.padding_horizontal_12,
          paddingStyle.padding_bottom_12,
        ]}
      >
        {engagementSummary.noOfLikes > 0 &&
          !advancedOptions.hideEngagementCount && (
            <AppText weight="bold" style={marginStyle.margin_bottom_3}>
              {engagementSummary.noOfLikes} likes
            </AppText>
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
            {clientAccountParams.id === createdBy.id ? (
              <>
                <Option
                  icon="explore-outline"
                  text="Advanced Options"
                  onPress={advancedOptionsPressPressCallback}
                />

                <Option icon="info" onPress={updatePressCallback} text="Edit" />

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
                icon="error"
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
  comment_box: {
    width: "54%",
    height: SIZE_42,
    ...borderStyle.border_color_2,
    ...borderStyle.border_radius_24,
    ...borderStyle.border_width_hairline,
  },
});

/**
 * {taggedAccounts && (
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
 */
