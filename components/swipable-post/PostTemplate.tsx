import { StyleSheet } from "react-native";
import {
  AccountParams,
  AudioWithTitle,
  LocationWithName,
} from "../../types/utility.types";
import { backgroundStyle, layoutStyle } from "../../styles";
import EngagementSection from "./EngagementSection";
import MetadataSection from "./MetadataSection";
import { ReactNode, useCallback, useState } from "react";
import Animated from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Pressable from "../utility-components/button/Pressable";

type PostTemplateProps = {
  isLiked: boolean;
  noOfLikes: number;
  onLikeIconPress: () => void;
  noOfComments: number;
  onCommentIconPress: () => void;
  onSendIconPress: () => void;
  onMoreIconPress: () => void;
  audio?: AudioWithTitle | null;
  location?: LocationWithName;
  author: AccountParams;
  caption?: string;
  children: ReactNode;
  height: number;
};

const PostTemplate = ({
  author,
  caption,
  audio,
  location,
  children,
  height,
  ...restProps
}: PostTemplateProps) => {
  const [captionCollapsed, setCaptionCollapsed] = useState(true);

  const toggleCaptionCollapsed = useCallback(
    () => setCaptionCollapsed((value) => !value),
    []
  );

  const longPressCallback = useCallback(() => {
    toggleCaptionCollapsed();
  }, []);

  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .onStart(longPressCallback)
    .runOnJS(true)
    .enabled(caption ? true : false);
  return (
    <GestureDetector gesture={longPressGesture}>
      <Animated.View style={{ height }}>
        {children}

        {!captionCollapsed && (
          <Pressable
            style={[
              StyleSheet.absoluteFill,
              backgroundStyle.background_color_3,
            ]}
            onPress={toggleCaptionCollapsed}
          />
        )}
        <MetadataSection
          author={author}
          captionCollapsed={captionCollapsed}
          onCaptionPress={toggleCaptionCollapsed}
          audio={audio}
          caption={caption}
          location={location}
        />
        <EngagementSection {...restProps} />
      </Animated.View>
    </GestureDetector>
  );
};

export default PostTemplate;
