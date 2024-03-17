import { View } from "react-native";
import { layoutStyle, marginStyle, paddingStyle } from "../styles";
import { useAppSelector } from "../hooks/storeHooks";
import { selectClientAccountParams } from "../store/client/client.selector";
import AppAvatar from "./AppAvatar";
import AppText from "./AppText";
import HighlightedText from "./HighlightedText";
import { SIZE_11 } from "../constants";
import { useNetInfo } from "@react-native-community/netinfo";
import { useState } from "react";

export type CommentPlaceHolderProps = {
  text: string;
  type?: "comment" | "reply";
};

export type CommentPlaceHolderStateParams =
  | {
      state: "failed";
      error?: {};
    }
  | {
      state: "idle" | "loading" | "success";
    };

export default function CommentPlaceHolder({
  text,
  type,
}: CommentPlaceHolderProps) {
  const clientAccountParams = useAppSelector(selectClientAccountParams);

  const { isInternetReachable } = useNetInfo();

  const [state, setState] = useState<CommentPlaceHolderStateParams>({
    state: "idle",
  });

  return (
    <View
      style={[
        paddingStyle.padding_12,
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_flex_start,
      ]}
    >
      <AppAvatar
        url={clientAccountParams.profilePictureUri}
        style={type === "reply" ? marginStyle.margin_left_24 : undefined}
        size={type === "reply" ? "extra-small" : "small"}
      />
      <View style={[layoutStyle.flex_1, marginStyle.margin_left_6]}>
        <AppText>{clientAccountParams.username}</AppText>
        <HighlightedText>{text}</HighlightedText>
        <AppText color="grey" style={[marginStyle.margin_top_6]} size={SIZE_11}>
          {isInternetReachable
            ? "uploading..."
            : "comment will be uploaded when connected"}
        </AppText>
      </View>
    </View>
  );
}
