import { useCallback, useState } from "react";
import { useAppSelector } from "../../hooks/storeHooks";
import { selectPost } from "../../store/post-store/post.selectors";
import PhotoAlbum from "./PhotoAlbum";
import PostTemplate from "./PostTemplate";
import { useRouter } from "expo-router";
import MomentVideoPlayer from "./MomentVideoPlayer";

export type SwipablePostProps = {
  id: string;
  preload: boolean;
  focused: boolean;
  height: number;
};

const SwipablePost = ({ id, preload, height, focused }: SwipablePostProps) => {
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
    taggedLocation,
  } = post;

  let content = null;
  if (post.type === "photo-post") {
    const { photos, usedAudio } = post;
    content = (
      <PhotoAlbum photos={photos} onDoubleTap={() => {}} preload={preload} />
    );
  } else if (post.type === "moment-post") {
    const { video } = post;
    content = (
      <MomentVideoPlayer
        {...video}
        focused={focused}
        preload={preload}
        onDoubleTap={() => {}}
      />
    );
  }

  return (
    <PostTemplate
      height={height}
      author={author}
      isLiked={isLiked}
      noOfComments={noOfComments}
      noOfLikes={noOfLikes}
      onCommentIconPress={() => {}}
      onLikeIconPress={() => {}}
      onMoreIconPress={() => {}}
      onSendIconPress={() => {}}
      audio={usedAudio}
      caption={caption}
      location={taggedLocation}
    >
      {content}
    </PostTemplate>
  );
};

export default SwipablePost;
