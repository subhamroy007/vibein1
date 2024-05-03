import { LayoutChangeEvent, View } from "react-native";
import { AudioParams } from "../../types/utility.types";
import {
  borderStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Photo from "../Photo";
import { SIZE_14, SIZE_16, SIZE_18, SIZE_90 } from "../../constants";
import Text from "../utility-components/text/Text";
import Avatar from "../Avatar";
import Button from "../utility-components/button/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

export type AudioDetailsProps = {
  audio: AudioParams;
  onLayout: (event: LayoutChangeEvent) => void;
  onSavePress: () => void;
};

export default function AudioDetails({
  audio,
  onLayout,
  onSavePress,
}: AudioDetailsProps) {
  const { isSaved, artists, author, posterUri, title } = audio;

  return (
    <View
      style={[
        layoutStyle.align_item_center,
        paddingStyle.padding_vertical_18,
        paddingStyle.padding_horizontal_12,
      ]}
      onLayout={onLayout}
    >
      <Photo
        uri={posterUri ? posterUri : author?.profilePictureUri!}
        style={[
          { width: SIZE_90, height: SIZE_90 },
          borderStyle.border_radius_6,
        ]}
      />
      <Text weight="bold" size={SIZE_16} style={marginStyle.margin_top_12}>
        {title ? title : "Original Audio"}
      </Text>
      {author ? (
        <View
          style={[
            marginStyle.margin_top_6,
            layoutStyle.flex_direction_row,
            layoutStyle.align_item_center,
          ]}
        >
          <Avatar url={author.profilePictureUri} size={SIZE_18} />
          <Text weight="bold" style={marginStyle.margin_left_3}>
            {author.username}
          </Text>
        </View>
      ) : (
        <Text weight="bold" size={SIZE_14} style={marginStyle.margin_top_6}>
          {artists}
        </Text>
      )}
      <View style={[layoutStyle.flex_direction_row, marginStyle.margin_top_24]}>
        <Button
          text={isSaved ? "saved" : "save"}
          stretch={1}
          backgroundColor={"black"}
          onPress={onSavePress}
          animateOnPress
        />
        <Button
          text={"use audio"}
          stretch={1}
          style={marginStyle.margin_left_12}
        />
      </View>
    </View>
  );
}
