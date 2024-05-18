import { View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { selectCommentPlaceholder } from "../../store/post-store/post.selectors";
import {
  backgroundStyle,
  layoutStyle,
  marginStyle,
  paddingStyle,
} from "../../styles";
import Avatar from "../Avatar";
import Text from "../utility-components/text/Text";
import MultilineText from "../utility-components/text/MultilineText";
import { SIZE_12, SIZE_30, SIZE_36 } from "../../constants";
import { useCallback } from "react";
import { fetchReplies } from "../../store/post-store/post.thunks";

export default function CommentPlaceHolder({ id }: { id: string }) {
  const placeholder = useAppSelector((state) =>
    selectCommentPlaceholder(state, id)
  );

  const dispatch = useAppDispatch();

  const loadReplies = useCallback(() => {
    if (!placeholder?.isReplyLoading) {
      dispatch(
        fetchReplies({
          commentId: placeholder?.repliedTo ? placeholder.repliedTo : id,
        })
      );
    }
  }, [
    id,
    placeholder?.postId,
    placeholder?.repliedTo,
    placeholder?.isReplyLoading,
  ]);

  if (!placeholder) return null;

  const {
    author,
    text,
    error,
    isReplyLoading,
    isUploading,
    noOfUnloadedReplies,
    repliedTo,
  } = placeholder;

  return (
    <View
      style={[
        backgroundStyle.background_color_1,
        paddingStyle.padding_12,
        layoutStyle.flex_direction_row,
        layoutStyle.align_item_flex_start,
        repliedTo ? marginStyle.margin_left_24 : undefined,
      ]}
    >
      <Avatar
        url={author.profilePictureUri}
        size={repliedTo ? SIZE_30 : SIZE_36}
      />
      <View style={[layoutStyle.flex_1, marginStyle.margin_horizontal_12]}>
        <Text weight="bold">{author.userId}</Text>
        <MultilineText text={text} style={marginStyle.margin_top_3} />
        <Text
          weight="semi-bold"
          color="grey"
          size={SIZE_12}
          style={marginStyle.margin_top_6}
        >
          {isUploading ? "uploading..." : "pending"}
        </Text>
        {noOfUnloadedReplies ? (
          <Text
            onPress={loadReplies}
            style={marginStyle.margin_top_3}
            weight="semi-bold"
            color="grey"
          >
            {isReplyLoading
              ? "loading..."
              : `show ${noOfUnloadedReplies} replies`}
          </Text>
        ) : undefined}
      </View>
    </View>
  );
}
