import { ReactNode } from "react";
import { AccountParams, AudioWithTitle } from "../../types/utility.types";
import { View } from "react-native";
import ContentContainer from "./ContentContainer";
import PostFooter from "./PostFooter";
import PostInteractionSection from "./PostInteractionSection";
import PostMetadataSection from "./PostMetadataSection";

export type PostTemplate = {
  onLike: () => void;
  onMoreIconPress: () => void;
  onTap: () => void;
  author: AccountParams;
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
        caption={caption}
        liftCaption={liftCaption}
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
      />
    </View>
  );
};

export default PostTemplate;
