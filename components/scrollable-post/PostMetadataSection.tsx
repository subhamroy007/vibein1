import { View } from "react-native";
import { marginStyle, paddingStyle } from "../../styles";
import Text from "../utility-components/text/Text";
import { SIZE_12, SIZE_14 } from "../../constants";
import { getRelativeTimeString } from "../../utility";
import { useRouter } from "expo-router";
import { nanoid } from "@reduxjs/toolkit";
import MultilineText from "../utility-components/text/MultilineText";
import { useCallback, useState } from "react";

export type PostMetadataSectionProps = {
  createdAt: string;
  noOfLikes: number;
  noOfComments: number;
  onCommentPress: () => void;
  onLikeCountPress: () => void;
  caption?: string;
};

const PostMetadataSection = ({
  createdAt,
  noOfComments,
  noOfLikes,
  onCommentPress,
  onLikeCountPress,
  caption,
}: PostMetadataSectionProps) => {
  const [captionCollapsed, setCaptionCollapsed] = useState(true);

  const switchCaptionCollapsedState = useCallback(
    () => setCaptionCollapsed((value) => !value),
    []
  );

  return (
    <View style={root_container_style}>
      {caption !== undefined && (
        <MultilineText
          text={caption}
          style={marginStyle.margin_bottom_12}
          collapsed={captionCollapsed}
          onPress={switchCaptionCollapsedState}
        />
      )}
      {noOfLikes > 0 ? (
        <Text weight="semi-bold" size={SIZE_14} onPress={onLikeCountPress}>
          {noOfLikes} likes
        </Text>
      ) : undefined}
      <Text
        weight="semi-bold"
        color="grey"
        size={SIZE_14}
        style={marginStyle.margin_top_6}
        onPress={onCommentPress}
      >
        show all {noOfComments} comments
      </Text>
      <Text
        color="grey"
        size={SIZE_12}
        style={marginStyle.margin_top_6}
        weight="medium"
      >
        {getRelativeTimeString(createdAt)}
      </Text>
    </View>
  );
};

const root_container_style = [
  paddingStyle.padding_horizontal_12,
  paddingStyle.padding_vertical_6,
];

export default PostMetadataSection;
