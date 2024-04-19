import {
  OutdatedVideoParams,
  OutdatedPhotoParams1,
} from "../types/utility.types";

const ip_address = "192.168.29.235";
const remote_url2 = "https://dlmf1r99us238.cloudfront.net";
const base_url = remote_url2;
const profile_picture_base_address = `${base_url}/profile-pictures/`;
const post_photo_base_address = `${base_url}/post-photos/`;
const post_moment_video_base_address = `${base_url}/post-moment-videos/`;
const post_moment_video_thumbnail_base_address = `${base_url}/post-moment-videos-thumbnails/`;
const post_moment_video_thumbnail_preview_base_address = `${base_url}/post-moment-videos-thumbnail-previews/`;
const post_photo_preview_base_address = `${base_url}/post-photo-previews/`;
const moment_video_poster_base_address = `${base_url}/moment-video-poster/`;

export const photo_hashs = [
  "mNF}4rt8F_Ip_MX8R*NGVsRjn4WBIBV[R%RjIpoLRkRjW;ofaejZ",
  "m7OBKK8|00-:00:?xG~V4o~CyWiv^mE1D%s:~VRjVZ-pIT%2b_M{",
  "mlF}=-RQbItQ~BRPWCt7axNGWBo0Ipaej[f6RjjZj@fPofWCayj@",
  "mCINgh00.mELYO9GOsbv0fNcZ$-A={t7oeIVI;xEs:Nb$*S#sot7",
  "m5FF1~?c0M016l^*%NkW0fIU+[%1~q574.nOS5s:?GRjxFjEtROY",
  "m27-7$-9000M#T?H0~5702X7=txuNXX9^Qxt?HIo%LRk9axZEg-o",
  "m9DmX9*J004T4TDOy??vYPx]-TNG_3x]Diic,:kVbbx[Q-RPt6X8",
  "m7Bez9^j02RQ0M9u}?={={$%V[V@NxI=j?-URPoJt7IpWWxZ$*N_",
  "mCE_v]01_3R50MS5EMxa9]xb~BS3ozs,IoR*V@%Mt6NHIVR+jrWY",
  "mlNAF.Rk~qe._3xuIoM{XTjFRPWBxuRjRj%2NFWBoLoffRs:ogR*",
  "mJGuXZtSS1D%-or=IUD%_NE1a0%2-p-:NGRjxaozNHNGR*Rjofs:",
  "mNC$y3t79aeo}[tQELjFxuM|E2jFR+SeM{sTjFWBbHs:aeV[ofof",
  "mQHLh_%z.TNHKlR%Rj9axui^aJt7%g-oxFNHIVR.o0R*j[jZkCs:",
  "mLHd$]NG0exu00%2NGM{~WWAxtxuITNaM{s:K5WBozs:R4NHs:WC",
  "mBGtmE580K-V5SoJE29a~BR%-U-:V@t6Wqj@0eIpkCxaxGIpt6%2",
  "m5Gb#D0053%h1VJG%gNXt+m[~ByB}rMwj=S#X59vD$XT.RZ#%Oi[",
  "mBE2d|~qpJo#4ns9E1-pNFVs={9aELIpIVxt57Rj%2WVJ7S2EL9t",
  "mbLe+^0xE1EL~DE1Ips-xar?kCWrI:oLs;R%WBShV@jZR*ofRjs;",
  "mKLXJJRO-;IUE1kXD%t7x]jEnixuIUjF%MRk~qNGX9Ri9Fs-s.ad",
  "mIFO.O_N-:9G00019t-:tR-p-pS2?HkXWAM{MxD%W=s:Sh%MkDof",
  "mANuVBcELax]uhTb.R%3=N%|?b.7rwR%s;kCAmV]IVIUx]o}a0RP",
  "mQH_3{?^xuwI~qtlR*V@-;o}xuxuT0%2WANG%h?HRjM{tl-pNGay",
  "mcGb0PD*IojZ~VE1RjofjYRkxZofWBjYt7RjNGjZozt7IoWXRjxu",
  "mFE_%6^*4:IoD%xFoft7~Vt6%1s:Ips:RkoeE2IoWCa}IoWCa}j[",
  "mDL4W$CTD%#6~BO@H=%MM{E3rq%h%fIBW=xa4:^*Ion$tlr=kqV@",
  "mCFrL:4T0f-p%LD$_4WC-=0KadMxIUD%s.j[XTxaofS$%gWUt7x]",
  "m9DSq8D%oa9u00az4:IoW9ae~q$*5SM{#RNGbbt89F%2%Na{xGxa",
  "mAJ7wL0L00~C00^%5R^+GdEO=_4:^bR4^ljE0M?b={t8n1oe9]9F",
  "mA9jDo9Z01~W,oS$Eg$M4.bc?anNtmM_rr%gNZ%LRP9a56%1?G9Z",
  "mCB{r+00-=IU00~W4.^*S4jF?G9a-:IVWCWVIpkCs-%LIo%LayIo",
];

export const poster_hashs = [
  "mnK-FFM{%#xu~Uax%Mt7Net8jGWBNGa#RQWBoyV@t7jZ%Mozn$j[",
  "mBAJZ..Tb_r;n3R3sA-V9ZITIoj[FyXnNcIn0zSi-WX9$L$goeJU",
  "mJCimirr0RbE~ms:9ds.OFNHxYn+9%t6-hWENNsm$~R*n#j]Rot5",
  "m36HT00f0f^i={NH9v={01-U?GS45Rt6}?0#X-%1rr9bD*%2Nan$",
  "mTE_{oIU_3NG~pV@tmaes8f+slkBELNGWAWBWqads9jYkCWBV@WB",
  "mp9?uOsqWcau%7oMWZjXohjYWToNj{jXjXj]kDjrjraybFj[oIa$",
  "m7CPCc~V4,9Y:gMwyFtmBWI@9FIUEgt7-V$*E1Rj%2-otSX9E1Io",
  "mGEo0.0M-UxZ^kofWCoJ0L~BEMs:t6NbozxatkE2-of+J:oxnibc",
  "mAExtn~V0|WrthIpxus:0L9arrWA^ks:aLkCNbR+ShR+RPRjoys:",
  "mrIEFXs:Xnof~pWBt7oLgOWBnOWBbIoKRPWVWBbHR*oesmfkR+fQ",
  "m79?LPV@0fxuE,j]EMWX9tS4%1ae56s:}@ae9tof-UoJxbWXI:fj",
  "mKCFn=ELOBM{}=Iot8NHSgWB-VI;JBa#wuWBWAf+kCxFWBoda}WC",
  "mAC$J.0NoZM|00}nFNxY9zE*}REO^iV[O[nNRS%09Z-:RPSixYI;",
  "mJL_Ol9bAU}[03OZOZs83nIoQ.$~x]X3-T$+zqt8t6n5-pVuEMK1",
  "mDF~N.%2WXt8%MxZ~pWX?Gsl57RjGvs:Mds:9GWXTKoz9]Newbbb",
  "m8H_AU4VIA9c009r~WS0Jb-sxuD%.5ND4o%gEVxboF%39D%3%iM^",
  "m7F}i_03?^9E-e00^5NG?]4TlRvhEU^-i%AUrUM^TC,I-9%#MfY3",
  "mHG[1f0gE1.7^iI;R-$g-PpIoLkB?^V@R5%L_2VtWBR*OWxGt6oz",
  "mcI4RyjX-oW=~AofR+ofE2R,NHR*afs:fPWCs.WCt5azNHR,oes.",
  "mbI;*NRj_2of~pR*%LxaNIt7RjxaMxoea{R*NHWCoeaf$*j]R*bH",
  "m35}dZ9D0K-ovxS%J9%258Mw?HjEM]xvxaEL.9sRV@Io9YW==|bI",
  "mCDJChM{kqIU~W%M.8M{_3oeIUtQIpWBxtW=bwxaMxM|?aRjROWC",
  "m7FEfoI8K*Na00~W4:9u${9F-A~CB?oIwKMwIS%M5Txu}=IU-nog",
  "mRJ7K_JT~VD%?bsmSNRjxZNGIVt7JAaejYS4s:WCNG%1ozWBs.WW",
  "mDIzu9%3qv_M:5IA[oXS01#k$LD*1f-6kXjFB:?aTJt5OmOsEfNF",
  "mEAmJ7~WSiIoX9xvt7fl9[E2a#ofsS%1oeoLt7oft7s:oekCNHR*",
  "mFBLPO}bi{wgO=EeNaof0|9[Ntoe+$,]w|nlAAt7$+a{NGoft6S1",
  "mCDS8tQ,tlwd7Q%Ki{E8=|T0D*ohEM%LjEays+Io%LV@D%j]R+oe",
  "mAD0J-0l00~A03^%.89yE.V?n2WUTMXUNLWBS%Sixto$VWaIjY%0",
  "mJIz3i|[BV7fP:Xl#q=M8wNzR$W9DNr=WVWA=?InbvxGo}s8bIWX",
];

export const getProfilePictureUrl = (index: number) =>
  `${profile_picture_base_address}profile_picture_${index}.jpg`;

export const getPostPhotoUrl = (index: number) =>
  `${post_photo_base_address}post_photo_${index}.jpg`;

export const getPostMomentVideoUrl = (index: number) =>
  `${post_moment_video_base_address}moment_video_${index}/master.m3u8`;

export const getPostMomentVideoThumbnailUrl = (index: number) =>
  `${post_moment_video_thumbnail_base_address}moment_video_thumbnail_${index}.jpg`;

export const getPostMomentVideoThumbnailPreviewUrl = (index: number) =>
  `${post_moment_video_thumbnail_preview_base_address}moment_video_thumbnail_preview_${index}.jpg`;

export const getPostPhotoPreviewUrl = (index: number) =>
  `${post_photo_preview_base_address}post_photo_preview_${index}.jpg`;

export const getMomentVideoPosterUri = (index: number) =>
  `${moment_video_poster_base_address}moment_video_poster_${index}.jpg`;

export const PHOTOS: OutdatedPhotoParams1[] = [
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

export const MOMENT_VIDEOS: OutdatedVideoParams[] = [
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
