import { ReactNode, useEffect, useRef } from "react";
import { AccountParams, AudioWithTitle } from "../../types/utility.types";
import { LayoutChangeEvent, View } from "react-native";
import ContentContainer from "./ContentContainer";
import PostFooter from "./PostFooter";
import PostInteractionSection from "./PostInteractionSection";
import PostMetadataSection from "./PostMetadataSection";
import { AccountSelectorParams } from "../../types/selector.types";

export type PostTemplate = {
  onLike: () => void;
  onMoreIconPress: () => void;
  onTap: () => void;
  author: AccountSelectorParams;
  children: ReactNode;
  caption?: string;
  sound?: "nosound" | "unavailbale" | "toggle";
  audio?: AudioWithTitle;
  liftCaption?: boolean;
  isLiked: boolean;
  onSendIconPress: () => void;
  onCommentBoxPress: () => void;
  createdAt: string;
  noOfLikes: number;
  noOfComments: number;
  onCommentPress: () => void;
  onLikeCountPress: () => void;
};

const PostTemplate = ({
  children,
  onLike,
  onTap,
  audio,
  caption,
  liftCaption,
  author,
  onMoreIconPress,
  sound,
  isLiked,
  onCommentBoxPress,
  onSendIconPress,
  createdAt,
  noOfComments,
  noOfLikes,
  onCommentPress,
  onLikeCountPress,
}: PostTemplate) => {
  return (
    <View>
      <PostFooter author={author} onMoreIconPress={onMoreIconPress} />
      <ContentContainer
        onDoubleTap={onLike}
        onTap={onTap}
        audio={audio}
        sound={sound}
      >
        {children}
      </ContentContainer>
      <PostInteractionSection
        isLiked={isLiked}
        onCommentBoxPress={onCommentBoxPress}
        onLikeIconPress={onLike}
        onSendIconPress={onSendIconPress}
      />
      <PostMetadataSection
        createdAt={createdAt}
        noOfComments={noOfComments}
        noOfLikes={noOfLikes}
        onCommentPress={onCommentPress}
        onLikeCountPress={onLikeCountPress}
        caption={caption}
      />
    </View>
  );
};

export default PostTemplate;
