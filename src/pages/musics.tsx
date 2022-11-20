import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import Layout from "../components/Layout";
import slugify from "../utils/slugify";
import { createDate, yymmdd, Music } from "../utils/metadata";
import Meta from "../components/Meta";

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(230,220,250,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      德国哲学家莱布尼茨曾对音乐作过这样的阐释：「音乐是心灵的算术练习，心灵在听音乐时计算着自己而不自知。」
    </p>
    <p>
      本页面正在建设中，过一段时间回来看看会发现更多内容哦～
    </p>
  </div>
</section>

const MusicView = ({ name, date, opus, number, category } : Music) => <article className="container content is-max-desktop" key={name}>
  <h2>
    <Link to={slugify(name)}>{name}</Link>
  </h2>
  <p>
    {category}，Op. {opus}, No. {number}
  </p>
  <p>
    {yymmdd(date)}
  </p>
</article>

const Display = ({ nodes }: { nodes: Music[] }) => <section className="section">
  {nodes.map(MusicView)}
</section>

export default function ({ data }: PageProps<Queries.MusicsQuery>) {
  const nodes: Music[] = data.notionDatabase!.childrenNotionPage!.map(page => {
    const { title, properties, lilypond, score } = page!
    return {
      name: title!,
      date: createDate(properties!.Date!.start!),
      category: properties!.Category!,
      description: properties!.Description!,
      suite: properties!.Suite !== null ? properties!.Suite : undefined,
      opus: properties!.Opus!,
      number: properties!.Number!,
      url: properties!.Bilibili_URL!,
      lilypond: lilypond!.publicURL!,
      score: score!.publicURL!,
    }
  })
  return (
    <Layout slug="musics">
      <main>
        <Introduction />
        <hr />
        <Display nodes={nodes}/>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query Musics {
    notionDatabase(title: {eq: "音乐"}) {
      childrenNotionPage {
        title
        properties {
          Date {
            start
          }
          Opus
          Number
          Category
          Suite
          Description
          Bilibili_URL
        }
        lilypond {
          publicURL
        }
        score {
          publicURL
        }
      }
    }
  }
`

export const Head = () => <Meta title="音乐"/>
