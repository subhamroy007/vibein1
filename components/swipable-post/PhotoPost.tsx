import { useAppSelector } from "../../hooks/storeHooks";
import { selectPost } from "../../store/post-store/post.selectors";
import PhotoAlbum from "./PhotoAlbum";
import PostTemplate from "./PostTemplate";

export type PhotoPostProps = {
  id: string;
  preload: boolean;
  height: number;
};

const PhotoPost = ({ id, preload, height }: PhotoPostProps) => {
  const post = useAppSelector((state) => selectPost(state, id));
  if (!post || post.type !== "photo-post") return null;

  const {
    author,
    engagementSummary,
    metadata,
    photos,
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
      <PhotoAlbum preload={preload} photos={photos} onDoubleTap={() => {}} />
    </PostTemplate>
  );
};

export default PhotoPost;
