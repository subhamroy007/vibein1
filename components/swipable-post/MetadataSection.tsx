import { ScrollView, StyleSheet, View } from "react-native";
import {
  AccountParams,
  AudioWithTitle,
  LocationWithName,
} from "../../types/utility.types";
import { layoutStyle, marginStyle, paddingStyle } from "../../styles";
import Animated from "react-native-reanimated";
import { LAYOUT_ANIMATION_400, SIZE_24 } from "../../constants";
import HighlightedText from "../HighlightedText";
import AuthorInfo from "./AuthorInfo";
import Capsule from "../utility-components/button/Capsule";

type MetadataSectionProps = {
  author: AccountParams;
  caption?: string;
  captionCollapsed: boolean;
  onCaptionPress: () => void;
  audio?: AudioWithTitle | null;
  location?: LocationWithName;
};

const MetadataSection = ({
  author,
  audio,
  caption,
  location,
  captionCollapsed,
  onCaptionPress,
}: MetadataSectionProps) => {
  return (
    <Animated.View layout={LAYOUT_ANIMATION_400} style={root_container_style}>
      <AuthorInfo account={author} />
      {caption ? (
        <ScrollView
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          fadingEdgeLength={20}
          style={marginStyle.margin_top_12}
        >
          <HighlightedText
            transparent
            onPress={onCaptionPress}
            collapsed={captionCollapsed}
          >
            {caption}
          </HighlightedText>
        </ScrollView>
      ) : undefined}
      {(audio || location) && (
        <View
          style={[
            marginStyle.margin_top_12,
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_center,
          ]}
        >
          {audio && (
            <Capsule
              icon="music"
              text={audio.title}
              backgroundColor="rgba(0, 0, 0, 0.3)"
              size={SIZE_24}
              textScale={0.5}
              weight="medium"
              width={location ? "48%" : undefined}
            />
          )}
          {location && (
            <Capsule
              icon="hashtag"
              text={location.name}
              backgroundColor="rgba(0, 0, 0, 0.3)"
              size={SIZE_24}
              textScale={0.5}
              weight="medium"
              width={audio ? "48%" : undefined}
              style={audio ? marginStyle.margin_left_12 : undefined}
            />
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root_container: {
    maxHeight: 400,
    width: "84%",
    bottom: 12,
    left: 0,
  },
});

const root_container_style = [
  styles.root_container,
  layoutStyle.position_absolute,
  paddingStyle.padding_left_12,
];

export default MetadataSection;
