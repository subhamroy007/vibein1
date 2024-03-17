import { useAppSelector } from "../../hooks/storeHooks";
import MomentVideoPlayer from "./MomentVideoPlayer";
import { selectPost } from "../../store/post-store/post.selectors";
import PostTemplate from "./PostTemplate";

const MomentPost = ({
  id,
  focused,
  preload,
}: {
  id: string;
  focused: boolean;
  preload: boolean;
}) => {
  const post = useAppSelector((state) => selectPost(state, id));

  if (!post || post.type == "photo-post") return null;

  const {
    metadata: { isLiked },
    createdAt,
    engagementSummary: { noOfComments, noOfLikes },
    video,
    author,
    caption,
    usedAudio,
  } = post;

  return (
    <PostTemplate
      author={author}
      createdAt={createdAt}
      isLiked={isLiked}
      noOfComments={noOfComments}
      noOfLikes={noOfLikes}
      onCommentBoxPress={() => {}}
      onLike={() => {}}
      onMoreIconPress={() => {}}
      onSendIconPress={() => {}}
      onTap={() => {}}
      audio={usedAudio === null ? undefined : usedAudio}
      caption={caption}
      sound={
        usedAudio === null
          ? "unavailbale"
          : usedAudio === undefined
          ? "nosound"
          : "toggle"
      }
    >
      <MomentVideoPlayer {...video} focused={focused} preload={preload} />
    </PostTemplate>
  );
};

export default MomentPost;
