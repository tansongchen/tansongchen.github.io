import React, { Fragment, ReactElement } from "react"
import { StaticImage } from "gatsby-plugin-image"
import { IconDefinition } from "@fortawesome/fontawesome-common-types"
import { faCode, faHome, faPen, faPhotoVideo, faPortrait } from "@fortawesome/free-solid-svg-icons"

interface Category {
  slug: string,
  image: ReactElement,
  name: string,
  icon: IconDefinition
  description: string
}

export const title = "众妙斋";

const imageDomain = "https://cdn.jsdelivr.net/gh/tansongchen/images@master/";

const summary: Category[] = [
  {slug: "", image: <StaticImage src={imageDomain + "avatar.webp"} alt="avatar" />, name: "主页", icon: faHome, description: ""},
  {slug: "about", image: <StaticImage src={imageDomain + "mitao.webp"} alt="mitao" />, name: "关于", icon: faPortrait, description: "了解更多关于我的背景"},
  {slug: "articles", image: <StaticImage src={imageDomain + "articles.webp"} alt="articles" />, name: "文章", icon: faPen, description: "读读我写的文字"},
  {slug: "photos", image: <StaticImage src={imageDomain + "photos.webp"} alt="photos" />, name: "相册", icon: faPhotoVideo, description: "看看我拍的照片"},
  {slug: "code", image: <StaticImage src={imageDomain + "code.webp"} alt="code" />, name: "代码", icon: faCode, description: "瞅瞅我写的代码"
  }
]

export default summary;
