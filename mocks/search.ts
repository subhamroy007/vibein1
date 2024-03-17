import { generateAccount } from "./accounts";
import { AccountSearchParams, SearchParams } from "./../types/utility.types";
import { getRandom } from ".";
import { HashTagSearchParams } from "../types/utility.types";

const hashtags = [
  "jadu",
  "samsung",
  "oneplue",
  "apple",
  "mobstar",
  "bollywood",
  "GOT",
  "Friends",
  "BBkivines",
  "byjuys",
  "mumbaindians",
];

export function generateHashtag(): HashTagSearchParams {
  return {
    name: hashtags[getRandom(hashtags.length - 1)],
    noOfPosts: getRandom(1000000, 47),
  };
}

export function generateHashtags(count: number): HashTagSearchParams[] {
  const hashtags: HashTagSearchParams[] = [];
  for (let i = 0; i < count; i++) {
    hashtags.push(generateHashtag());
  }
  return hashtags;
}

export function generateAccountSearch(): AccountSearchParams {
  return {
    category: "others",
    ...generateAccount(["fullname", "no-of-followers"]),
  };
}

export function generateAccountsSearch(count: number): AccountSearchParams[] {
  const accounts: AccountSearchParams[] = [];
  for (let i = 0; i < count; i++) {
    accounts.push(generateAccountSearch());
  }
  return accounts;
}

export function generateSearchResult(count: number): SearchParams[] {
  const result: SearchParams[] = [];

  for (let i = 0; i < count; i++) {
    result.push(
      Math.random() > 0.5
        ? { type: "account", ...generateAccountSearch() }
        : { type: "hashtag", ...generateHashtag() }
    );
  }

  return result;
}

export const SEARCH_HISTORY: SearchParams[] = [
  { type: "hashtag", name: "hotgirls", noOfPosts: 424 },
  { type: "hashtag", name: "topless", noOfPosts: 5743 },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  { type: "hashtag", name: "sareewomens", noOfPosts: 435784 },
  { type: "text", text: "falak tak chal" },
  {
    type: "text",
    text: "super hot",
  },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  { type: "hashtag", name: "NO1", noOfPosts: 1946735 },
  { type: "hashtag", name: "TeensonBkini", noOfPosts: 93 },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  { type: "text", text: "bhabi ji ghar par ha" },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  { type: "text", text: "bangla memes" },
  { type: "text", text: "new york posts" },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  {
    type: "account",
    category: "",
    ...generateAccount(["fullname", "no-of-followers"]),
  },
  { type: "text", text: "funny memes" },
];
