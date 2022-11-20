import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import Layout from "../components/Layout";
import slugify from "../utils/slugify";
import { createDate, Video, yymmdd } from "../utils/metadata";
import Meta from "../components/Meta";

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(230,220,250,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      记录生活的美好时刻。
    </p>
  </div>
</section>

const VideoFrame = ({url, name, category, date}: Video) => <article className="container content is-max-desktop" key={url}>
  <h2>
    <Link to={slugify(name)}>{name}</Link>
  </h2>
  <p>
    {yymmdd(date)}
  </p>
  <div style={{position: "relative", padding: "30% 45%"}}>
    <iframe style={{position: "absolute", width: "100%", height: "100%", left: "0", top: "0"}} src={url + "&high_quality=1"} scrolling="no" data-border="0" data-frameborder="no" data-framespacing="0" data-allowfullscreen="true">
    </iframe>
  </div>
</article>

const Display = ({ nodes }: { nodes: Video[] }) => <section className="section">
  {nodes.map(VideoFrame)}
</section>

export default function ({ data }: PageProps<Queries.VideosQuery>) {
  const nodes: Video[] = data.notionDatabase!.childrenNotionPage!.map(page => {
    const { title, properties } = page!
    return {
      name: title!,
      date: createDate(properties!.Date!.start!),
      category: properties!.Category!,
      description: properties!.Description!,
      suite: properties!.Suite !== null ? properties!.Suite : undefined,
      url: properties?.Bilibili_URL!
    }
  });
  return (
    <Layout slug="videos">
      <main>
        <Introduction />
        <hr />
        <Display nodes={nodes}/>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query Videos {
    notionDatabase(title: {eq: "视频"}) {
      childrenNotionPage {
        title
        properties {
          Date {
            start
          }
          Category
          Suite
          Description
          Bilibili_URL
        }
      }
    }
  }
`

export const Head = () => <Meta title="视频"/>
