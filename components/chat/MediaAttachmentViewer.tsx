import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { MessageMediaAttachmentParams } from "../../types/store.types";
import { backgroundStyle, layoutStyle, paddingStyle } from "../../styles";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import Photo from "../Photo";
import Video from "../Video";
import Icon from "../Icon";
import { BlurView } from "expo-blur";

const enteringAnimation = SlideInDown.duration(300);
const exitingAnimation = SlideOutDown.duration(300);

const MediaAttachmentViewer = ({
  files,
  onClose,
}: {
  files: MessageMediaAttachmentParams[];
  onClose: () => void;
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, backgroundStyle.background_color_4]}
      entering={enteringAnimation}
      exiting={exitingAnimation}
    >
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        onMomentumScrollEnd={({ nativeEvent: { contentOffset } }) => {
          setActiveIndex(Math.round(contentOffset.x / screenWidth));
        }}
      >
        {files.map((file, index) => {
          if (file.type === "photo") {
            return (
              <Photo
                uri={file.url}
                backgroundTransparent
                contained
                style={[layoutStyle.height_100_percent, { width: screenWidth }]}
                key={index}
              />
            );
          }
          return (
            <Video
              uri={file.url}
              backgroundTransparent
              contained
              style={[layoutStyle.height_100_percent, { width: screenWidth }]}
              preload
              focused={index === activeIndex}
              key={index}
            />
          );
        })}
      </ScrollView>
      <View
        style={[
          layoutStyle.width_100_percent,
          layoutStyle.position_absolute,
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          layoutStyle.justify_content_space_between,
          { top: 0, marginVertical: 45 },
          paddingStyle.padding_horizontal_18,
        ]}
      >
        <Pressable onPress={onClose}>
          <Icon name="close" color="white" />
        </Pressable>
        <Icon name="download" color="white" />
      </View>
    </Animated.View>
  );
};

export default MediaAttachmentViewer;
