import Animated from "react-native-reanimated";
import { useSpringAnimation } from "../../hooks/animation.hooks";
import { backgroundStyle, layoutStyle, marginStyle } from "../../styles";
import {
  COLOR_1,
  COLOR_15,
  COLOR_6,
  LAYOUT_ANIMATION_400,
  SIZE_10,
  SIZE_12,
  SIZE_120,
  SIZE_15,
  SIZE_24,
  SIZE_36,
  SIZE_48,
  SIZE_6,
  SIZE_9,
} from "../../constants";
import { ReactNode, useCallback, useState } from "react";
import AdvancedGesture from "../utility-components/AdvancedGesture";
import { AudioWithTitle } from "../../types/utility.types";
import HighlightedText from "../HighlightedText";
import { ScrollView, StyleSheet, View } from "react-native";
import Pressable from "../utility-components/button/Pressable";
import Icon, { AnimatedIcon } from "../utility-components/icon/Icon";
import Text from "../utility-components/text/Text";
import PressableIcon from "../utility-components/button/PressableIcon";
import { useMediaMutedState } from "../../hooks/client.hooks";
import PressableIconCircle from "../utility-components/button/PressableIconCircle";

type ContentContainerProps = {
  onDoubleTap: () => void;
  onTap: () => void;
  children: ReactNode;
  caption?: string;
  sound?: "nosound" | "unavailbale" | "toggle";
  audio?: AudioWithTitle;
  liftCaption?: boolean;
};

const ContentContainer = ({
  onDoubleTap,
  onTap,
  children,
  caption,
  audio,
  liftCaption,
  sound,
}: ContentContainerProps) => {
  const [animatedStyle, startAnimation] = useSpringAnimation();

  const [mute, _, toggleMuteState] = useMediaMutedState();

  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsedState = useCallback(
    () => setCollapsed((value) => !value),
    []
  );

  const doubleTapCallback = useCallback(() => {
    startAnimation();
    onDoubleTap();
  }, [onDoubleTap]);

  const volumeIconPressCallback = useCallback(() => {
    if (sound === "nosound") {
      console.log("video has no sound");
    } else if (sound === "unavailbale") {
      console.log("audio is unavailable");
    } else {
      toggleMuteState();
    }
  }, [toggleMuteState, sound]);

  return (
    <AdvancedGesture
      style={root_container_style}
      onDoubleTap={doubleTapCallback}
      onTap={onTap}
      onLongPress={caption ? toggleCollapsedState : undefined}
    >
      {children}
      {audio && (
        <View style={audio_label_style}>
          <Icon name="moment-solid" size={SIZE_15} color={COLOR_1} />
          <Text
            color={COLOR_1}
            weight="regular"
            size={SIZE_12}
            style={marginStyle.margin_left_6}
          >
            {audio.title}
          </Text>
        </View>
      )}
      {sound ? (
        <PressableIconCircle
          solid
          backgroundColor={COLOR_15}
          name={
            sound !== "toggle"
              ? "volume-off-solid"
              : mute
              ? "volume-off-solid"
              : "volume-on-solid"
          }
          color={COLOR_1}
          size={SIZE_24}
          hitSlop={{ horizontal: SIZE_36, vertical: SIZE_36 }}
          onPress={volumeIconPressCallback}
          style={volume_icon_style}
        />
      ) : undefined}
      <AnimatedIcon
        name={"heart-solid"}
        color={COLOR_6}
        style={animatedStyle}
        size={SIZE_48}
      />
      {!collapsed && (
        <Pressable onPress={toggleCollapsedState} style={overlay_style} />
      )}
      {caption ? (
        <Animated.View
          layout={LAYOUT_ANIMATION_400}
          style={[
            caption_container_style,
            { bottom: liftCaption ? SIZE_24 : SIZE_12, width: "80%" },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            fadingEdgeLength={24}
          >
            <HighlightedText
              transparent
              collapsed={collapsed}
              onPress={toggleCollapsedState}
            >
              {caption}
            </HighlightedText>
          </ScrollView>
        </Animated.View>
      ) : undefined}
    </AdvancedGesture>
  );
};

const styles = StyleSheet.create({
  caption_container: { left: SIZE_9, maxHeight: SIZE_120 * 4 },
  audio_label: { top: SIZE_10, left: SIZE_6 },
  volume_icon: { bottom: SIZE_10, right: SIZE_12 },
  root_container: {
    aspectRatio: "2/3",
  },
});

const root_container_style = [
  layoutStyle.content_center,
  styles.root_container,
];

const volume_icon_style = [layoutStyle.position_absolute, styles.volume_icon];

const overlay_style = [
  StyleSheet.absoluteFill,
  backgroundStyle.background_color_3,
];

const caption_container_style = [
  styles.caption_container,
  layoutStyle.position_absolute,
  layoutStyle.overflow_hidden,
];

const audio_label_style = [
  styles.audio_label,
  layoutStyle.position_absolute,
  layoutStyle.flex_direction_row,
];

export default ContentContainer;
