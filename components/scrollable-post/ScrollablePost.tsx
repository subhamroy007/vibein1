import { useCallback, useState } from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectPost } from "../../store/post-store/post.selectors";
import PhotoAlbum from "./PhotoAlbum";
import PostTemplate from "./PostTemplate";
import { useRouter } from "expo-router";
import { Portal } from "@gorhom/portal";
import PostLikeSection from "../portals/PostLikeSection";
import SendSection from "../portals/SendSection";
import MomentVideoPlayer from "./MomentVideoPlayer";

export type ScrollablePostProps = {
  id: string;
  preload: boolean;
  focused: boolean;
};

const ScrollablePost = ({ id, preload, focused }: ScrollablePostProps) => {
  const post = useAppSelector((state) => selectPost(state, id));

  const [likes, setLikes] = useState(false);

  const [send, setSend] = useState(false);

  const toggleLikes = useCallback(() => {
    setLikes((value) => !value);
  }, []);

  const toggleSend = useCallback(() => {
    setSend((value) => !value);
  }, []);

  const router = useRouter();

  const onCommentPress = useCallback(() => {
    router.push({
      params: { postId: id },
      pathname: "/comment_route",
    });
  }, [id]);

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
      onTap={() => {}}
      audio={usedAudio === null ? undefined : usedAudio}
      caption={caption}
      sound={usedAudio ? "toggle" : undefined}
      liftCaption={false}
      onCommentPress={onCommentPress}
    >
      {content}
      {likes && (
        <Portal>
          <PostLikeSection id={id} onDismiss={toggleLikes} />
        </Portal>
      )}
      {send && (
        <Portal>
          <SendSection onDismiss={toggleSend} />
        </Portal>
      )}
    </PostTemplate>
  );
};

export default ScrollablePost;
