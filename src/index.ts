import { pinyin } from "pinyin-pro";
import type { ExifData } from "./components/ExifImage.astro";

export interface Entry {
  title: string;
  date: Date;
  categories: string[];
  description: string;
  suite?: string;
}

export interface Article extends Entry {
  cover: string;
}

export interface Photo extends Entry {
  image: string;
  exif: ExifData;
}

export interface Video extends Entry {
  uid: string;
}

export interface Music extends Entry {
  opus: number;
  number: number;
  lilypond: string;
  score: string;
  url?: string;
}

export interface Recipe extends Entry {
  image: string;
  rating: string;
}

export interface Dress extends Entry {
  photographer: string;
  image: string;
  exif: ExifData;
}

export interface Suite<T extends Entry> {
  name: string;
}

export interface Collection {
  image: string;
  name: string;
  icon: string;
  description: string;
}

export const title = "众妙斋";
export const site = "https://tansongchen.com";
export const endpoint = "https://www.tansongchen.workers.dev";

export const yymmdd = (d: Date) =>
  `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
export const mmdd = (d: Date) => `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
export const basename = (path: string) => path.split("/").pop()!.split(".")[0];
export const createDate = (s: string) => {
  const date = new Date(s);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};

const articles: Collection = {
  image: "../images/index/articles.jpg",
  name: "文章",
  icon: "fa6-solid:pen",
  description: "阅读我笔下的文字",
};
const photos: Collection = {
  image: "../images/index/photos.jpg",
  name: "照片",
  icon: "fa6-solid:image",
  description: "欣赏我拍的照片",
};
const videos: Collection = {
  image: "../images/index/videos.jpg",
  name: "视频",
  icon: "fa6-solid:video",
  description: "观看我拍的视频",
};
const musics: Collection = {
  image: "../images/index/musics.jpg",
  name: "音乐",
  icon: "fa6-solid:music",
  description: "聆听我写的音乐",
};
const recipes: Collection = {
  image: "../images/index/recipes.jpg",
  name: "菜谱",
  icon: "fa6-solid:utensils",
  description: "品尝我做的佳肴",
};
const dresses: Collection = {
  image: "../images/index/recipes.jpg",
  name: "女装",
  icon: "fa6-solid:female",
  description: "好耶，是女装！",
};

export default { articles, photos, videos, musics, recipes, dresses };

export function slugify(title: string) {
  return pinyin(title, {
    toneType: "none",
    type: "array",
    removeNonZh: true,
  }).join("-");
}

export async function get(
  route: string,
  query: Record<string, string>
): Promise<any | void> {
  try {
    const url = `${endpoint}${route}?${Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {}
}

export async function put(route: string, data: any): Promise<any | void> {
  try {
    const response = await fetch(endpoint + route, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(data),
    });
    window.alert("提交成功！");
    return response.json();
  } catch (error) {
    window.alert("提交失败！");
  }
}
