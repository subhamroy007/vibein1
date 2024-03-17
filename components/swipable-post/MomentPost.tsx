import { useAppSelector } from "../../hooks/storeHooks";
import { selectPost } from "../../store/post-store/post.selectors";
import MomentVideoPlayer from "./MomentVideoPlayer";
import PostTemplate from "./PostTemplate";

export type MomentPostProps = {
  id: string;
  focused: boolean;
  preload: boolean;
  height: number;
};

const MomentPost = ({ focused, id, preload, height }: MomentPostProps) => {
  const post = useAppSelector((state) => selectPost(state, id));

  if (!post || post.type !== "moment-post") return null;

  const {
    author,
    engagementSummary,
    metadata,
    video,
    caption,
    taggedLocation,
    usedAudio,
  } = post;

  return (
    <PostTemplate
      height={height}
      author={author}
      isLiked={metadata.isLiked}
      noOfComments={engagementSummary.noOfComments}
      noOfLikes={engagementSummary.noOfLikes}
      onCommentIconPress={() => {}}
      onLikeIconPress={() => {}}
      onMoreIconPress={() => {}}
      onSendIconPress={() => {}}
      audio={usedAudio}
      caption={caption}
      location={taggedLocation}
    >
      <MomentVideoPlayer
        preload={preload}
        focused={focused}
        {...video}
        onDoubleTap={() => {}}
      />
    </PostTemplate>
  );
};

export default MomentPost;
