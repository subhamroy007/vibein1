import { useCallback, useState } from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectPost } from "../../store/post-store/post.selectors";
import PhotoAlbum from "./PhotoAlbum";
import PostTemplate from "./PostTemplate";
import { useRouter } from "expo-router";
import { Portal } from "@gorhom/portal";
import PostLikeSection from "../portals/PostLikeSection";
import MomentVideoPlayer from "./MomentVideoPlayer";
import SendSection from "../portals/SendSection";
import PostCommentSecion from "../portals/PostCommentSection";

export type ScrollablePostProps = {
  id: string;
  preload: boolean;
  focused: boolean;
  onPress: (id: string, index: number) => void;
  index: number;
  shouldSetScrollPosition: boolean;
};

const ScrollablePost = ({
  id,
  preload,
  focused,
  onPress,
  index,
  shouldSetScrollPosition,
}: ScrollablePostProps) => {
  const post = useAppSelector((state) => selectPost(state, id));

  const [likes, setLikes] = useState(false);

  const [send, setSend] = useState(false);

  const [comment, setComment] = useState(false);

  const toggleLikes = useCallback(() => {
    setLikes((value) => !value);
  }, []);

  const toggleSend = useCallback(() => {
    setSend((value) => !value);
  }, []);

  const toggleComment = useCallback(() => {
    setComment((value) => !value);
  }, []);

  const router = useRouter();

  const onTap = useCallback(() => {
    onPress(id, index);
  }, [onPress, id, index]);

  if (!post) return null;

  const {
    metadata: { isLiked },
    createdAt,
    engagementSummary: { noOfComments, noOfLikes },
    author,
    usedAudio,
    caption,
  } = post;

  let content = null;
  if (post.type === "photo-post") {
    const { photos, usedAudio } = post;
    content = (
      <PhotoAlbum
        photos={photos}
        audio={usedAudio ? usedAudio : undefined}
        preload={preload}
      />
    );
  } else if (post.type === "moment-post") {
    const { video } = post;
    content = (
      <MomentVideoPlayer {...video} focused={focused} preload={preload} />
    );
  }

  return (
    <PostTemplate
      onLikeCountPress={toggleLikes}
      author={author}
      createdAt={createdAt}
      isLiked={isLiked}
      noOfComments={noOfComments}
      noOfLikes={noOfLikes}
      onCommentBoxPress={() => {}}
      onLike={() => {}}
      onMoreIconPress={() => {}}
      onSendIconPress={toggleSend}
      onTap={onTap}
      audio={usedAudio === null ? undefined : usedAudio}
      caption={caption}
      sound={usedAudio ? "toggle" : undefined}
      liftCaption={true}
      onCommentPress={toggleComment}
    >
      {content}
      {likes && (
        <Portal>
          <PostLikeSection id={id} onClose={toggleLikes} />
        </Portal>
      )}
      {send && (
        <Portal>
          <SendSection onDismiss={toggleSend} onSend={() => {}} />
        </Portal>
      )}
      {comment && (
        <Portal>
          <PostCommentSecion onClose={toggleComment} postId={id} />
        </Portal>
      )}
    </PostTemplate>
  );
};

export default ScrollablePost;
