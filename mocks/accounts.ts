import { nanoid } from "@reduxjs/toolkit";
import { getProfilePictureUrl } from "./data";
import { AccountResponseParams } from "../types/response.types";
import { getRandom } from ".";

const usernames = [
  "bhavin_333",
  "sonalikul",
  "sharanyantics",
  "shrushtijainn",
  "urmillathakka22",
  "kohlihimansh",
  "hardiksharma.a",
  "shambhavi1997",
  "payalgamingg",
  "_bachuuuu",
  "_itz_shinu_",
  "vans_hika8142",
  "nandini_jaiswal_29",
  "jaimin_009",
  "mich.sharonnnn",
  "ptl_jayshri_14",
  "ahmedkhan_3012",
  "zaiduu_here",
  "patel_dhaval_005",
  "iamkrish.___",
];

const fullnames = [
  "Krish Patel",
  "ᴹᴿ°᭄ⓩⒶⒾⒹ❣",
  "patel_dhaval_005",
  "patel_dhaval_00Ethesham Ahmed Khan5",
  "ptl_jayshri_🍁",
  "M I C H 🤍",
  "Jaimin Mangroliya",
  "Nandini Jaiswal 🔥🌝",
  "Vanshika kamboj",
  "Medico",
  "Payal Gaming",
  "_bachuuuu",
  "Shambhavi Singh",
  "Hardik Sharma",
  "Himansh Kohli",
  "urmilla",
  "Shrushti",
  "Sharanya Rajgopal",
  "Sonali Kulkarni",
  "Bhavin Bhanushali 🇮🇳",
];

const bios = [
  `#arusquad
snap: aryanshiiiii
Himachal || INDORE 📍`,

  `Be a miracle. ✨`,

  `📍Mumbai
1.8M on Snapchat
Mgmt: @castingbeans
Mail: castingbeanstalents@gmail.com`,

  `Authenticity is power💫
#12thFail streaming on @disneyplushotstar
`,

  `not adulting today
`,

  `Coffee addict, occasional poet, forever grooving & an intuitive actor.
Twitter: tamannaahspeaks`,

  `Managed by @svfbrands
📍Kolkata
📩 priyankamitra06@gmail.com`,

  `Here to stay ♾
Growing and glowing ✨
Managed by @madify.official
`,

  `@thriftxpayal
@s8ul.esports CC
Managed by - @8bit_creatives
`,

  `Mumbai, India📍
Snapchat: navika_k
Managed by: @spatel2209`,

  `🌱 Podcast @kindnesswithamy
📈 Director @meatlessmeetmore
🍀 Ambassador @genv_eng`,

  `For inquiries - aliyahamidi0@gmail.com
Tap on link in bio to watch my latest music videos`,

  `Ssup peaches?
It’d be great to watch sunsets together 🏜️
.`,

  `Live life to the fullest..🗽
Fashion • Lifestyle • Creator
MGMT @mrmayankm
Snapchat : Gima_ashi`,

  `Air hugs :)
Live and let Live♥️`,

  `#Dimple #Anupamaa
DEL | BOM📍
For collaborations`,

  `Magnificently cursed ✨
Archie in Half Ca, Mahi in Sisters, Akanksha in Hostel daze
& the biggest Taylor Swift fan you might know.`,

  `You probably mispronounced my name:)
✨Your reel life shinchan✨
Managed by: @monkentertainment
Tumhaara dil📍`,

  `👉DANCER 👈,a simple person 💃,want'$ to be something DIFFERENT`,

  `📍Delhi
Backup account: @kanishkasss_03
Business queries : kanishkasharmabusiness@gmail.com
YouTube👇🏻`,
];

export const generateAccountObject = () => {
  const account: AccountResponseParams = {
    _id: nanoid(),
    username: usernames[getRandom(usernames.length - 1)],
    profilePictureUrl: getProfilePictureUrl(getRandom(40)),
    isActive: true,
    hasRequestedToFollow: false,
    isAvailable: true,
    isBlocked: false,
    isFollowed: false,
    isFollowing: Math.random() < 0.5 ? true : false,
    isPrivate: false,
    fullname: fullnames[getRandom(fullnames.length - 1)],
    bio: bios[getRandom(bios.length - 1)],
    isFavourite: false,
    isFollowRequestPending: false,
    isMemoryHidden: false,
    noOfFollowers: getRandom(1000000, 100),
    noOfFollowings: getRandom(200, 5),
    noOfPosts: getRandom(100, 9),
  };

  return account;
};

export const generateAccountObjects = (size: number) => {
  const accounts: AccountResponseParams[] = [];

  for (let i = 0; i < size; i++) {
    accounts.push(generateAccountObject());
  }
  return accounts;
};
