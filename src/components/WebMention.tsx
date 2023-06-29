import React from "react";
import { site, yymmdd } from "../utils/metadata";
import useSWR from "swr";

interface MentionData {
  type: "entry";
  author: {
    type: "card";
    name: string;
    url: string;
    photo: string;
  };
  url: string;
  published: string;
  "wm-received": string;
  "wm-id": number;
  content: {
    text: string;
    html: string;
  };
}

interface WebMentionFeed {
  type: "feed";
  name: "Webmentions";
  children: MentionData[];
}

function Mention({ type, author, url, published, content }: MentionData) {
  return (
    <div className="content" key={url}>
      <p>
        <span style={{ fontSize: "150%", marginRight: "1rem" }}>
          @{author.name || "无名氏"}
        </span>
        {yymmdd(new Date(published))}
      </p>
      <p>{content.text}</p>
    </div>
  );
}

function WebMention({ art, slug }: Record<string, string>) {
  const target = `${site}/${art}/${slug}`;
  const token = `GevpnlAkAbTXHes6nLWnLw`;
  const query = (target: string) => `https://webmention.io/api/mentions.jf2?target=${target}&token=${token}`;
  const { data, error } = useSWR<WebMentionFeed>(target, (target) =>
    fetch(query(target)).then((res) => res.json())
  );
  if (!data || error) return <div></div>;
  return (
    <section className="section">
      <article className="container is-max-desktop">
        <h1 className="title">站外评论</h1>
        {data.children.length ? data.children.map(Mention) : <p>暂无站外评论</p>}
      </article>
    </section>
  );
}

export default WebMention;
