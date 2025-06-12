import { type IExifImage } from "../islands/ExifImage";

export interface Piece {
  name: string;
  date: Date;
  category: string;
  description: string;
  suite?: string;
}

export interface Article extends Piece {
  cover: string;
}

export interface Dress extends Piece {
  photographer: string;
  exifImage: IExifImage;
}

export interface Photo extends Piece {
  exifImage: IExifImage;
}

export interface Video extends Piece {
  uid: string;
}

export interface Music extends Piece {
  opus: number;
  number: number;
  lilypond: string;
  score: string;
  url?: string;
}

export interface Recipe extends Piece {
  rating: string;
}

export interface Suite<T extends Piece> {
  name: string;
}

export interface Art {
  slug: string;
  image: string;
  name: string;
  icon: string;
  description: string;
  single: string;
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

const articles: Art = {
  slug: "articles",
  single: "article",
  image: "../images/index/articles.jpg",
  name: "文章",
  icon: "fa6-solid:pen",
  description: "阅读我笔下的文字",
};
const photos: Art = {
  slug: "photos",
  single: "photo",
  image: "../images/index/photos.jpg",
  name: "照片",
  icon: "fa6-solid:image",
  description: "欣赏我拍的照片",
};
const videos: Art = {
  slug: "videos",
  single: "video",
  image: "../images/index/videos.jpg",
  name: "视频",
  icon: "fa6-solid:video",
  description: "观看我拍的视频",
};
const musics: Art = {
  slug: "musics",
  single: "music",
  image: "../images/index/musics.jpg",
  name: "音乐",
  icon: "fa6-solid:music",
  description: "聆听我写的音乐",
};
const recipes: Art = {
  slug: "recipes",
  single: "recipe",
  image: "../images/index/recipes.jpg",
  name: "菜谱",
  icon: "fa6-solid:utensils",
  description: "品尝我做的佳肴",
};
const dresses: Art = {
  slug: "dresses",
  single: "dress",
  image: "../images/index/recipes.jpg",
  name: "女装",
  icon: "fa6-solid:female",
  description: "好耶，是女装！",
};

export const arts = [articles, photos, videos, musics, recipes, dresses];

export default arts.slice(0, -1);
