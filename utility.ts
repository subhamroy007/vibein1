import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig } from "./types/utility.types";

export function formatTimeDifference(utcDateString: string): string {
  const utcDate = new Date(utcDateString);
  const currentDate = new Date();

  const timeDifferenceInMilliseconds =
    currentDate.getTime() - utcDate.getTime();
  const timeDifferenceInSeconds = Math.floor(
    timeDifferenceInMilliseconds / 1000
  );

  if (timeDifferenceInSeconds < 60) {
    return "just now";
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 604800) {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 2419200) {
    const weeks = Math.floor(timeDifferenceInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 29030400) {
    const months = Math.floor(timeDifferenceInSeconds / 2419200);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(timeDifferenceInSeconds / 29030400);
    return `${years} yr${years > 1 ? "s" : ""} ago`;
  }
}

export function formatNumber(n: number): string {
  if (n < 1000) {
    return n.toString();
  } else if (n < 1e6) {
    return `${Math.floor(n / 1000)}k`;
  } else if (n < 1e9) {
    return `${Math.floor(n / 1e6)}m`;
  } else {
    return `${Math.floor(n / 1e9)}b`;
  }
}

export const createAppAsyncThunk =
  createAsyncThunk.withTypes<AsyncThunkConfig>();

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
