import { ListRenderItemInfo } from "react-native";
import { layoutStyle } from "../styles";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../hooks/storeHooks";
import { useCallback, useEffect } from "react";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchComments, uploadComment } from "../store/post-store/post.thunks";
import Comment from "../components/comment-section/Comment";
import Animated from "react-native-reanimated";
import { CommentListItemIdentifier } from "../types/store.types";
import { LAYOUT_ANIMATION_400 } from "../constants";
import CommentUploader from "../components/comment-section/CommentUploader";
import { nanoid } from "@reduxjs/toolkit";
import CommentPlaceHolder from "../components/comment-section/CommentPlaceholder";
import { selectCommentSection } from "../store/post-store/post.selectors";

export default function CommentRoute() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    (submittedText: string) => {
      dispatch(
        uploadComment({
          id: nanoid(),
          text: submittedText,
          postId: postId!,
        })
      );
    },
    [postId]
  );

  useEffect(() => {
    dispatch(fetchComments({ postId: postId! }));
  }, [postId]);

  const commentSectionParams = useAppSelector((state) =>
    selectCommentSection(state, postId!)
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CommentListItemIdentifier>) => {
      if (item.type === "comment") {
        return <Comment {...item} id={item.key} />;
      } else {
        return <CommentPlaceHolder {...item} id={item.key} />;
      }
    },
    []
  );

  return (
    <SafeAreaView style={layoutStyle.flex_fill}>
      <Header title="Comments" />
      <Animated.FlatList
        data={commentSectionParams?.comments}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        overScrollMode={"never"}
        removeClippedSubviews={false}
        itemLayoutAnimation={LAYOUT_ANIMATION_400}
      />
      <CommentUploader onSubmit={onSubmit} />
    </SafeAreaView>
  );
}
