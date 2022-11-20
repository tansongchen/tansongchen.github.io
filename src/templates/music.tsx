import React, { Fragment, ReactElement } from "react";
import { graphql, PageProps } from "gatsby";
import { FaCode, FaMusic, FaStickyNote } from "react-icons/fa";
import Layout from "../components/Layout";
import { createDate, Music, yymmdd } from "../utils/metadata";

interface DownloadItemProps {
  name: string,
  url: string,
  icon: ReactElement
}

const DownloadItem = ({ name, url, icon }: DownloadItemProps) => <div className="column" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
  <div style={{padding: "1rem"}}>
    { icon }
    <span>  {name}</span>
  </div>
  <div style={{padding: "1rem"}}>
    <a href={url}>
      <button className="button is-info">下载</button>
    </a>
  </div>
</div>

export default function ({ data }: PageProps<Queries.MusicQuery>) {
  const { title, properties, lilypond: lilypondURL, score: scoreURL } = data.notionPage!;
  const { name, category, description, opus, number, lilypond, score, url }: Music = {
    name: title!,
    date: createDate(properties!.Date!.start!),
    category: properties!.Category!,
    description: properties!.Description!,
    suite: properties!.Suite !== null ? properties!.Suite : undefined,
    opus: properties!.Opus!,
    number: properties!.Number!,
    lilypond: lilypondURL!.publicURL!,
    score: scoreURL!.publicURL!,
    url: properties!.Bilibili_URL !== null ? properties!.Bilibili_URL : undefined,
  }
  return <Layout slug="music/op1no5">
    <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(220,230,255,0.5), rgba(255,255,255,0.5))"}}>
      <article className="container content is-max-desktop">
        <div className="has-text-centered">
          <h1>Op. {opus}（{category}）</h1>
          <h2>No. {number}，「{name}」</h2>
        </div>
        <p>
          {description}
        </p>
      </article>
    </section>
    <section className="section">
      <div className="container is-max-desktop">
        <div className="columns">
          {/* <DownloadItem name={"音频"} url={"/op1no5.mp3"} icon={<FaMusic />}/> */}
          <DownloadItem name={"乐谱"} url={score} icon={<FaStickyNote />}/>
          <DownloadItem name={"源码"} url={lilypond} icon={<FaCode />}/>
        </div>
      </div>
    {
      url ?
      <article className="container content is-max-desktop">
        <div style={{position: "relative", padding: "30% 45%"}}>
          <iframe style={{position: "absolute", width: "100%", height: "100%", left: "0", top: "0"}} src={url + "&high_quality=1"} scrolling="no" data-border="0" data-frameborder="no" data-framespacing="0" data-allowfullscreen="true">
          </iframe>
        </div>
      </article> :
      <div></div>
    }
    </section>
  </Layout>
}

export const query = graphql`
  query Music ($id: String) {
    notionPage(id: {eq: $id}) {
      title
      properties {
        Date {
          start
        }
        Category
        Description
        Suite
        Bilibili_URL
        Opus
        Number
      }
      lilypond {
        publicURL
      }
      score {
        publicURL
      }
    }
  }
`
