import { pinyin } from "pinyin-pro";

export default function slugify(title: string) {
  return pinyin(title, {
    toneType: "none",
    type: "array",
    removeNonZh: true,
  }).join("-");
}
