import React, { Fragment, ReactElement } from "react"
import { StaticImage } from "gatsby-plugin-image"
import { IconDefinition } from "@fortawesome/fontawesome-common-types"
import { faCode, faHome, faPen, faImage, faVideo, faPortrait, faUtensils, faFemale } from "@fortawesome/free-solid-svg-icons"

interface Category {
  slug: string,
  image: ReactElement,
  name: string,
  icon: IconDefinition
  description: string
}

export const title = "众妙斋";

export const yymmdd = (d: Date) => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
export const mmdd = (d: Date) => `${d.getMonth() + 1} 月 ${d.getDate()} 日`;

const summary: Category[] = [
  {slug: "", image: <StaticImage src="../images/index/mitao.jpg" alt="avatar" width={300} height={300}/>, name: "主页", icon: faHome, description: ""},
  {slug: "about", image: <StaticImage src="../images/index/mitao.jpg" alt="mitao" width={300} height={300}/>, name: "关于", icon: faPortrait, description: "了解更多关于我的背景"},
  {slug: "articles", image: <StaticImage src="../images/index/articles.jpg" alt="articles" width={300} height={300}/>, name: "文章", icon: faPen, description: "阅读我笔下的文字"},
  {slug: "photos", image: <StaticImage src="../images/index/photos.jpg" alt="photos" width={300} height={300}/>, name: "照片", icon: faImage, description: "欣赏我拍的照片"},
  {slug: "videos", image: <StaticImage src="../images/index/videos.jpg" alt="photos" width={300} height={300}/>, name: "视频", icon: faVideo, description: "观看我拍的视频"},
  {slug: "code", image: <StaticImage src="../images/index/code.jpg" alt="code" width={300} height={300}/>, name: "代码", icon: faCode, description: "关注我写的代码"},
  {slug: "recipes", image: <StaticImage src="../images/index/recipes.jpg" alt="recipes" width={300} height={300}/>, name: "菜谱", icon: faUtensils, description: "品尝我做的佳肴"},
  // {slug: "dresses", image: <StaticImage src="../images/index/recipes.jpg" alt="dresses" width={300} height={300}/>, name: "女装", icon: faFemale, description: "好耶，是女装！"}
]

export const [home, about, articles, photos, code, recipes, dresses] = summary;

export default summary;
