import { useCallback, useState } from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectPost } from "../../store/post-store/post.selectors";
import PhotoAlbum from "./PhotoAlbum";
import PostTemplate from "./PostTemplate";
import { useRouter } from "expo-router";
import { Portal } from "@gorhom/portal";
import PostLikeSection from "../portals/PostLikeSection";
import SendSection from "../portals/SendSection";

const PhotoPost = ({ id, preload }: { id: string; preload: boolean }) => {
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

  if (!post || post.type === "moment-post") return null;

  const {
    metadata: { isLiked },
    createdAt,
    engagementSummary: { noOfComments, noOfLikes },
    photos,
    author,
    usedAudio,
    caption,
  } = post;

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
      liftCaption={photos.length > 1 || photos[0].taggedAccounts ? true : false}
      onCommentPress={onCommentPress}
    >
      <PhotoAlbum
        photos={photos}
        audio={usedAudio ? usedAudio : undefined}
        preload={preload}
      />
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

export default PhotoPost;
