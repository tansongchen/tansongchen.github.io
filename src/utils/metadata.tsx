import React, { ReactElement } from "react";
import { IGatsbyImageData, StaticImage } from "gatsby-plugin-image";
import { FaCode, FaPen, FaImage, FaVideo, FaPortrait, FaUtensils, FaFemale } from "react-icons/fa";
import { IExifImage } from "../components/ExifImage";

interface Piece {
  name: string,
  date: Date,
  category: string,
  description: string,
  suite?: string
}

export interface Article extends Piece {
  image: IGatsbyImageData
}

export interface Dress extends Piece {
  photographer: string,
  exifImage: IExifImage
}

export interface Photo extends Piece {
  exifImage: IExifImage
}

export interface Video extends Piece {
  url: string
}

export interface Recipe extends Piece {
  image: IGatsbyImageData,
  rating: string
}

export interface Suite<T extends Piece> {
  name: string,
}

export interface Page {
  slug: string,
  image: ReactElement,
  name: string,
  icon: ReactElement,
  description: string
}

interface Art extends Page {
  single: string
}

export const title = "众妙斋";

export const yymmdd = (d: Date) => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
export const mmdd = (d: Date) => `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
export const createDate = (s: string) => {
  const date = new Date(s);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

const about: Page = {slug: "about", image: <StaticImage src="../images/index/mitao.jpg" alt="mitao" width={300} height={300}/>, name: "关于", icon: <FaPortrait />, description: "了解更多关于我的背景"};
const articles: Art = {slug: "articles", single: 'article', image: <StaticImage src="../images/index/articles.jpg" alt="articles" width={300} height={300}/>, name: "文章", icon: <FaPen />, description: "阅读我笔下的文字"};
const photos: Art = {slug: "photos", single: 'photo', image: <StaticImage src="../images/index/photos.jpg" alt="photos" width={300} height={300}/>, name: "照片", icon: <FaImage />, description: "欣赏我拍的照片"};
const videos: Art = {slug: "videos", single: 'video', image: <StaticImage src="../images/index/videos.jpg" alt="photos" width={300} height={300}/>, name: "视频", icon: <FaVideo />, description: "观看我拍的视频"};
const recipes: Art = {slug: "recipes", single: 'recipe', image: <StaticImage src="../images/index/recipes.jpg" alt="recipes" width={300} height={300}/>, name: "菜谱", icon: <FaUtensils />, description: "品尝我做的佳肴"};
const dresses: Art = {slug: "dresses", single: 'dress', image: <StaticImage src="../images/index/recipes.jpg" alt="dresses" width={300} height={300}/>, name: "女装", icon: <FaFemale />, description: "好耶，是女装！"};

export const arts = [articles, photos, videos, recipes, dresses];

export default [about, articles, photos, videos, recipes];
