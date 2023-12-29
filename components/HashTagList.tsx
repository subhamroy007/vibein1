import { useCallback, useState } from "react";
import { ScrollView, TouchableHighlight, View } from "react-native";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../styles";
import AppText from "./AppText";
import { formatNumber } from "../utility";
import { COLOR_7, SIZE_11 } from "../constants";
import RoundIconfrom "./RoundIcon";
import { HashtagResponseParams } from "../types/component.types";

export type HashTagListProps = {
  hashtags: HashtagResponseParams[];
  onHashTagSelect: (hashtag: string) => void;
};

export type HashTagListItemProps = {
  onHashTagSelect: (hashtag: string) => void;
} & HashtagResponseParams;

export function HashTagListItem({
  name,
  noOfPosts,
  onHashTagSelect,
}: HashTagListItemProps) {
  const hashtagSelectCallback = useCallback(
    () => onHashTagSelect(name),
    [name, onHashTagSelect]
  );

  return (
    <TouchableHighlight onPress={hashtagSelectCallback} underlayColor={COLOR_7}>
      <View
        style={[
          layoutStyle.flex_direction_row,
          layoutStyle.align_item_center,
          paddingStyle.padding_horizontal_12,
          paddingStyle.padding_vertical_6,
        ]}
      >
        <RoundIconname="hashtag" />
        <View style={marginStyle.margin_left_6}>
          <AppText size={SIZE_11}>{name}</AppText>
          <AppText size={SIZE_11} color="grey">
            {formatNumber(noOfPosts)} Posts
          </AppText>
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default function HashTagList({
  onHashTagSelect,
  hashtags,
}: HashTagListProps) {
  return (
    <ScrollView keyboardShouldPersistTaps="always">
      {hashtags.map((hashtag) => (
        <HashTagListItem
          {...hashtag}
          key={hashtag.name}
          onHashTagSelect={onHashTagSelect}
        />
      ))}
    </ScrollView>
  );
}
