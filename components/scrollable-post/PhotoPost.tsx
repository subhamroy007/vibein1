import { useAppSelector } from "../../hooks/storeHooks";
import { selectPost } from "../../store/post-store/post.selectors";
import PhotoAlbum from "./PhotoAlbum";
import PostTemplate from "./PostTemplate";

const PhotoPost = ({ id, preload }: { id: string; preload: boolean }) => {
  const post = useAppSelector((state) => selectPost(state, id));
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
      sound={usedAudio ? "toggle" : undefined}
      liftCaption={photos.length > 1 || photos[0].taggedAccounts ? true : false}
    >
      <PhotoAlbum
        photos={photos}
        audio={usedAudio ? usedAudio : undefined}
        preload={preload}
      />
    </PostTemplate>
  );
};

export default PhotoPost;
