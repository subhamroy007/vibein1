import { PostPhotoParams } from "../types/utility.types";

const ip_address = "192.168.29.235";
const profile_picture_base_address = `http://${ip_address}:5500/profile-pictures/`;
const post_photo_base_address = `http://${ip_address}:5500/post-photos/`;
const post_photo_preview_base_address = `http://${ip_address}:5500/post-photo-previews/`;

export const getProfilePictureUrl = (index: number) =>
  `${profile_picture_base_address}image%20${index}.jpg`;

const getPostPhotoUrl = (index: number) =>
  `${post_photo_base_address}image${index}.jpg`;

const getPostPhotoPreviewUrl = (index: number) =>
  `${post_photo_preview_base_address}image${index}.jpg`;

export const PHOTOS: PostPhotoParams[] = [
  {
    url: getPostPhotoUrl(1),
    previewUrl: getPostPhotoPreviewUrl(1),
    aspectRatio: "1/1",
    width: 1080,
    height: 1080,
  },
  {
    url: getPostPhotoUrl(2),
    previewUrl: getPostPhotoPreviewUrl(2),
    aspectRatio: "16/9",
    width: 720,
    height: 405,
  },
  {
    url: getPostPhotoUrl(3),
    previewUrl: getPostPhotoPreviewUrl(3),
    aspectRatio: "16/9",
    width: 1080,
    height: 605,
  },
  {
    url: getPostPhotoUrl(4),
    previewUrl: getPostPhotoPreviewUrl(4),
    aspectRatio: "16/9",
    width: 1080,
    height: 608,
  },
  {
    url: getPostPhotoUrl(5),
    previewUrl: getPostPhotoPreviewUrl(5),
    aspectRatio: "1/1",
    width: 1080,
    height: 1080,
  },
  {
    url: getPostPhotoUrl(6),
    previewUrl: getPostPhotoPreviewUrl(6),
    aspectRatio: "4/3",
    width: 720,
    height: 540,
  },
  {
    url: getPostPhotoUrl(7),
    previewUrl: getPostPhotoPreviewUrl(7),
    aspectRatio: "4/3",
    width: 1080,
    height: 810,
  },
  {
    url: getPostPhotoUrl(8),
    previewUrl: getPostPhotoPreviewUrl(8),
    aspectRatio: "16/9",
    width: 1080,
    height: 608,
  },
  {
    url: getPostPhotoUrl(9),
    previewUrl: getPostPhotoPreviewUrl(9),
    aspectRatio: "1/1",
    width: 1024,
    height: 1024,
  },
  {
    url: getPostPhotoUrl(10),
    previewUrl: getPostPhotoPreviewUrl(10),
    aspectRatio: "4/3",
    width: 860,
    height: 645,
  },
  {
    url: getPostPhotoUrl(11),
    previewUrl: getPostPhotoPreviewUrl(11),
    aspectRatio: "4/3",
    width: 1000,
    height: 750,
  },
  {
    url: getPostPhotoUrl(12),
    previewUrl: getPostPhotoPreviewUrl(12),
    aspectRatio: "16/9",
    width: 1080,
    height: 608,
  },
  {
    url: getPostPhotoUrl(13),
    previewUrl: getPostPhotoPreviewUrl(13),
    aspectRatio: "4/3",
    width: 900,
    height: 675,
  },
  {
    url: getPostPhotoUrl(14),
    previewUrl: getPostPhotoPreviewUrl(14),
    aspectRatio: "16/9",
    width: 1080,
    height: 608,
  },
  {
    url: getPostPhotoUrl(15),
    previewUrl: getPostPhotoPreviewUrl(15),
    aspectRatio: "16/9",
    width: 1080,
    height: 608,
  },
  {
    url: getPostPhotoUrl(16),
    previewUrl: getPostPhotoPreviewUrl(16),
    aspectRatio: "3/4",
    width: 1080,
    height: 1440,
  },
  {
    url: getPostPhotoUrl(17),
    previewUrl: getPostPhotoPreviewUrl(17),
    aspectRatio: "3/4",
    width: 1000,
    height: 1333,
  },
  {
    url: getPostPhotoUrl(18),
    previewUrl: getPostPhotoPreviewUrl(18),
    aspectRatio: "3/4",
    width: 1000,
    height: 1333,
  },
  {
    url: getPostPhotoUrl(19),
    previewUrl: getPostPhotoPreviewUrl(19),
    aspectRatio: "3/4",
    width: 1080,
    height: 1440,
  },
];
