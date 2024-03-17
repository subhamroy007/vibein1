import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BOTTOM_TAB_HEIGHT,
  COLOR_1,
  COLOR_6,
  SIZE_11,
  SIZE_12,
  SIZE_24,
} from "../../constants";
import Icon from "../Icon";
import {
  backgroundStyle,
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import AppText from "../AppText";
import usePost from "../../hooks/postHook";
import { formatNumber } from "../../utility";
import AppPressable from "../AppPressable";
import { IconName } from "../../types/component.types";
import Avatar from "../Avatar";
import HighlightedText from "../HighlightedText";
import Animated, { Layout } from "react-native-reanimated";
import { useCallback, useState } from "react";
import SwipeUpPortal from "../SwipeUpPortal";
import { PostTag } from "../PostTag";
import Option from "../Option";
import AppButton from "../AppButton";
import FullScreenAlbum from "./FullScreenAlbum";
import FullScreenVideoPlayer from "./FullScreenVideoPlayer";
import { useRouter } from "expo-router";

export default function FullScreenPost({
  id,
  postHeight,
  focused,
}: {
  id: string;
  postHeight: number;
  focused: boolean;
}) {
  const {
    postParams,
    togglePostLikeStateCallback,
    togglePostSaveStateCallback,
  } = usePost(id);

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

  const [isMoreOptionPortalOpen, setMoreOptionPortalState] = useState(false);

  const toggleMoreOptionPortalCallback = useCallback(
    () => setMoreOptionPortalState((prevState) => !prevState),
    [setMoreOptionPortalState]
  );

  const [isCaptionCollapsed, setCaptionCollapsedState] = useState(true);

  const toggleCaptionCollapsedState = useCallback(
    () => setCaptionCollapsedState((prevState) => !prevState),
    []
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
  const gotoProifile = useCallback(() => {
    router.push({
      pathname: "/account/[username]",
      params: { username: postParams?.createdBy.username },
    });
  }, [router, postParams]);
  if (!postParams) {
    return null;
  }

  const {
    createdBy,
    engagementSummary: { noOfComments, noOfLikes },
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
    <View
      style={[
        {
          height: postHeight,
        },
        backgroundStyle.background_color_4,
      ]}
    >
      {restParams.postType === "photo" && (
        <FullScreenAlbum
          photos={restParams.photos}
          onDoubleTap={doubleTapCallback}
        />
      )}
      {restParams.postType === "moment" && (
        <FullScreenVideoPlayer
          video={restParams.video}
          onDoubleTap={doubleTapCallback}
          focused={focused}
        />
      )}
      {!isCaptionCollapsed && (
        <Pressable
          style={[StyleSheet.absoluteFill, backgroundStyle.background_color_3]}
          onPress={toggleCaptionCollapsedState}
        />
      )}
      <View style={[styles.template_container, StyleSheet.absoluteFill]}>
        <View style={styles.metadata_container}>
          <Animated.View
            style={styles.caption_and_author_info_container}
            layout={Layout.duration(300)}
          >
            <View style={styles.author_info_container}>
              <Pressable onPress={gotoProifile}>
                <Avatar url={createdBy.profilePictureUri} />
              </Pressable>
              <AppText
                style={marginStyle.margin_left_9}
                color={COLOR_1}
                onPress={gotoProifile}
              >
                {createdBy.username}
              </AppText>
              <AppButton
                text={createdBy.isFollowed ? "following" : "follow"}
                style={marginStyle.margin_left_9}
                hasOutline
                hideBackground
                outlineColor={COLOR_1}
                size={SIZE_12}
                outlineWidth={2}
                gap={0.7}
              />
            </View>
            {caption && (
              <Animated.ScrollView
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={36}
                style={marginStyle.margin_top_6}
                nestedScrollEnabled
              >
                <HighlightedText
                  transparent
                  onPress={toggleCaptionCollapsedState}
                  collapsed={isCaptionCollapsed}
                >
                  {caption}
                </HighlightedText>
              </Animated.ScrollView>
            )}
          </Animated.View>
          {(taggedAccounts || taggedLocation) && (
            <View style={styles.resource_container}>
              {taggedAccounts && (
                <Capsule
                  icon="tag-solid"
                  title={
                    taggedAccounts.length === 1
                      ? taggedAccounts[0]
                      : `${taggedAccounts.length} accounts`
                  }
                  style={marginStyle.margin_right_12}
                  onPress={toggleTagPortalOpen}
                />
              )}
              <Capsule icon="add" title={"kolkata asansol park"} />
            </View>
          )}
        </View>
        <View style={styles.icons_container}>
          <View style={layoutStyle.align_item_center}>
            <AppPressable
              onPress={togglePostLikeStateCallback}
              hitSlop={SIZE_24}
            >
              <Icon
                name={isLiked ? "heart-solid" : "heart-outline"}
                color={isLiked ? COLOR_6 : COLOR_1}
              />
            </AppPressable>
            {noOfLikes > 0 && (
              <AppText
                style={marginStyle.margin_top_6}
                color={COLOR_1}
                weight="regular"
              >
                {formatNumber(noOfLikes)}
              </AppText>
            )}
          </View>
          <View style={layoutStyle.align_item_center}>
            <Icon name="comment-outline" color={COLOR_1} />
            {noOfComments > 0 && (
              <AppText
                style={marginStyle.margin_top_6}
                color={COLOR_1}
                weight="regular"
              >
                {formatNumber(noOfComments)}
              </AppText>
            )}
          </View>

          <Icon name="send-outline" color={COLOR_1} />
          <AppPressable hitSlop={SIZE_24} onPress={togglePostSaveStateCallback}>
            <Icon
              name={isSaved ? "star-solid" : "star-outline"}
              color={COLOR_1}
            />
          </AppPressable>
          <Pressable hitSlop={SIZE_24} onPress={toggleMoreOptionPortalCallback}>
            <Icon name="more-vert" color={COLOR_1} size={SIZE_24} />
          </Pressable>
        </View>
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
            <Option
              icon="info"
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
            <Option
              icon="error"
              text="Report"
              color="red"
              onPress={reportPressCallback}
            />
          </View>
        </SwipeUpPortal>
      )}
    </View>
  );
}

export type CapsuleProps = {
  title: string;
  icon: IconName;
} & PressableProps;

export function Capsule({ icon, title, style, ...restProps }: CapsuleProps) {
  const styleProp = typeof style === "object" ? style : {};

  return (
    <Pressable {...restProps} style={[styles.capsule_container, styleProp]}>
      <Icon name={icon} size={SIZE_12} color={COLOR_1} />
      <AppText
        color={COLOR_1}
        size={SIZE_11}
        style={marginStyle.margin_left_6}
        weight="regular"
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  capsule_container: {
    ...backgroundStyle.background_color_3,
    ...paddingStyle.padding_horizontal_9,
    ...paddingStyle.padding_vertical_6,
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.align_item_center,
    ...borderStyle.border_radius_12,
    ...borderStyle.border_width_hairline,
    ...borderStyle.border_color_1,
  },
  icons_container: {
    height: 300,
    ...layoutStyle.align_item_center,
    ...layoutStyle.justify_content_space_around,
  },
  template_container: {
    ...layoutStyle.flex_direction_row,
    ...layoutStyle.align_item_flex_end,
    ...paddingStyle.padding_12,
  },
  resource_container: {
    ...layoutStyle.flex_direction_row,
    ...marginStyle.margin_top_9,
  },
  author_info_container: {
    ...layoutStyle.align_item_center,
    ...layoutStyle.flex_direction_row,
  },
  caption_and_author_info_container: {
    maxHeight: 240,
  },
  metadata_container: {
    ...layoutStyle.flex_1,
    ...layoutStyle.justify_content_flex_end,
    ...marginStyle.margin_right_9,
    height: 300,
  },
});
