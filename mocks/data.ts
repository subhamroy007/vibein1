import { PostMomentVideoParams, PostPhotoParams } from "../types/utility.types";

const ip_address = "192.168.29.235";
const profile_picture_base_address = `http://${ip_address}:5500/profile-pictures/`;
const post_photo_base_address = `http://${ip_address}:5500/post-photos/`;
const post_moment_video_base_address = `http://${ip_address}:5500/post-moment-videos/`;
const post_moment_video_thumbnail_base_address = `http://${ip_address}:5500/post-moment-videos-thumbnails/`;
const post_moment_video_thumbnail_preview_base_address = `http://${ip_address}:5500/post-moment-videos-thumbnail-previews/`;
const post_photo_preview_base_address = `http://${ip_address}:5500/post-photo-previews/`;

export const getProfilePictureUrl = (index: number) =>
  `${profile_picture_base_address}profile_picture_${index}.jpg`;

const getPostPhotoUrl = (index: number) =>
  `${post_photo_base_address}post_photo_${index}.jpg`;

const getPostMomentVideoUrl = (index: number) =>
  `${post_moment_video_base_address}moment_video_${index}.mp4`;

const getPostMomentVideoThumbnailUrl = (index: number) =>
  `${post_moment_video_thumbnail_base_address}moment_video_thumbnail_${index}.jpg`;

const getPostMomentVideoThumbnailPreviewUrl = (index: number) =>
  `${post_moment_video_thumbnail_preview_base_address}moment_video_thumbnail_preview_${index}.jpg`;

const getPostPhotoPreviewUrl = (index: number) =>
  `${post_photo_preview_base_address}post_photo_preview_${index}.jpg`;

export const PHOTOS: PostPhotoParams[] = [
  {
    url: getPostPhotoUrl(1),
    previewUrl: getPostPhotoPreviewUrl(1),
  },
  {
    url: getPostPhotoUrl(2),
    previewUrl: getPostPhotoPreviewUrl(2),
  },
  {
    url: getPostPhotoUrl(3),
    previewUrl: getPostPhotoPreviewUrl(3),
  },
  {
    url: getPostPhotoUrl(4),
    previewUrl: getPostPhotoPreviewUrl(4),
  },
  {
    url: getPostPhotoUrl(5),
    previewUrl: getPostPhotoPreviewUrl(5),
  },
  {
    url: getPostPhotoUrl(6),
    previewUrl: getPostPhotoPreviewUrl(6),
  },
  {
    url: getPostPhotoUrl(7),
    previewUrl: getPostPhotoPreviewUrl(7),
  },
  {
    url: getPostPhotoUrl(8),
    previewUrl: getPostPhotoPreviewUrl(8),
  },
  {
    url: getPostPhotoUrl(9),
    previewUrl: getPostPhotoPreviewUrl(9),
  },
  {
    url: getPostPhotoUrl(10),
    previewUrl: getPostPhotoPreviewUrl(10),
  },
  {
    url: getPostPhotoUrl(11),
    previewUrl: getPostPhotoPreviewUrl(11),
  },
  {
    url: getPostPhotoUrl(12),
    previewUrl: getPostPhotoPreviewUrl(12),
  },
  {
    url: getPostPhotoUrl(13),
    previewUrl: getPostPhotoPreviewUrl(13),
  },
  {
    url: getPostPhotoUrl(14),
    previewUrl: getPostPhotoPreviewUrl(14),
  },
  {
    url: getPostPhotoUrl(15),
    previewUrl: getPostPhotoPreviewUrl(15),
  },
  {
    url: getPostPhotoUrl(16),
    previewUrl: getPostPhotoPreviewUrl(16),
  },
  {
    url: getPostPhotoUrl(17),
    previewUrl: getPostPhotoPreviewUrl(17),
  },
  {
    url: getPostPhotoUrl(18),
    previewUrl: getPostPhotoPreviewUrl(18),
  },
  {
    url: getPostPhotoUrl(19),
    previewUrl: getPostPhotoPreviewUrl(19),
  },
  {
    url: getPostPhotoUrl(20),
    previewUrl: getPostPhotoPreviewUrl(20),
  },
  {
    url: getPostPhotoUrl(21),
    previewUrl: getPostPhotoPreviewUrl(21),
  },
  {
    url: getPostPhotoUrl(22),
    previewUrl: getPostPhotoPreviewUrl(22),
  },
  {
    url: getPostPhotoUrl(23),
    previewUrl: getPostPhotoPreviewUrl(23),
  },
  {
    url: getPostPhotoUrl(24),
    previewUrl: getPostPhotoPreviewUrl(24),
  },
  {
    url: getPostPhotoUrl(25),
    previewUrl: getPostPhotoPreviewUrl(25),
  },
  {
    url: getPostPhotoUrl(26),
    previewUrl: getPostPhotoPreviewUrl(26),
  },
  {
    url: getPostPhotoUrl(27),
    previewUrl: getPostPhotoPreviewUrl(27),
  },
  {
    url: getPostPhotoUrl(28),
    previewUrl: getPostPhotoPreviewUrl(28),
  },
  {
    url: getPostPhotoUrl(29),
    previewUrl: getPostPhotoPreviewUrl(29),
  },
  {
    url: getPostPhotoUrl(30),
    previewUrl: getPostPhotoPreviewUrl(30),
  },
  {
    url: getPostPhotoUrl(31),
    previewUrl: getPostPhotoPreviewUrl(31),
  },
  {
    url: getPostPhotoUrl(32),
    previewUrl: getPostPhotoPreviewUrl(32),
  },
  {
    url: getPostPhotoUrl(33),
    previewUrl: getPostPhotoPreviewUrl(33),
  },
];

export const MOMENT_VIDEOS: PostMomentVideoParams[] = [
  {
    url: getPostMomentVideoUrl(1),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(1),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(1),
    },
  },
  {
    url: getPostMomentVideoUrl(2),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(2),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(2),
    },
  },
  {
    url: getPostMomentVideoUrl(3),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(3),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(3),
    },
  },
  {
    url: getPostMomentVideoUrl(4),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(4),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(4),
    },
  },
  {
    url: getPostMomentVideoUrl(5),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(5),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(5),
    },
  },
  {
    url: getPostMomentVideoUrl(6),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(6),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(6),
    },
  },
  {
    url: getPostMomentVideoUrl(7),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(7),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(7),
    },
  },
  {
    url: getPostMomentVideoUrl(8),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(8),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(8),
    },
  },
  {
    url: getPostMomentVideoUrl(9),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(9),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(9),
    },
  },
  {
    url: getPostMomentVideoUrl(10),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(10),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(10),
    },
  },
  {
    url: getPostMomentVideoUrl(11),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(11),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(11),
    },
  },
  {
    url: getPostMomentVideoUrl(12),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(12),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(12),
    },
  },
  {
    url: getPostMomentVideoUrl(13),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(13),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(13),
    },
  },
  {
    url: getPostMomentVideoUrl(14),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(14),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(14),
    },
  },
  {
    url: getPostMomentVideoUrl(15),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(15),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(15),
    },
  },
  {
    url: getPostMomentVideoUrl(16),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(16),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(16),
    },
  },
  {
    url: getPostMomentVideoUrl(17),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(17),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(17),
    },
  },
  {
    url: getPostMomentVideoUrl(18),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(18),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(18),
    },
  },
  {
    url: getPostMomentVideoUrl(19),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(19),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(19),
    },
  },
  {
    url: getPostMomentVideoUrl(20),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(20),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(20),
    },
  },
  {
    url: getPostMomentVideoUrl(21),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(21),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(21),
    },
  },
  {
    url: getPostMomentVideoUrl(22),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(22),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(22),
    },
  },
  {
    url: getPostMomentVideoUrl(23),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(23),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(23),
    },
  },
  {
    url: getPostMomentVideoUrl(24),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(24),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(24),
    },
  },
  {
    url: getPostMomentVideoUrl(25),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(25),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(25),
    },
  },
  {
    url: getPostMomentVideoUrl(26),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(26),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(26),
    },
  },
  {
    url: getPostMomentVideoUrl(27),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(27),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(27),
    },
  },
  {
    url: getPostMomentVideoUrl(28),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(28),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(28),
    },
  },
  {
    url: getPostMomentVideoUrl(29),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(29),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(29),
    },
  },
  {
    url: getPostMomentVideoUrl(30),
    thumbnail: {
      url: getPostMomentVideoThumbnailUrl(30),
      previewUrl: getPostMomentVideoThumbnailPreviewUrl(30),
    },
  },
];
