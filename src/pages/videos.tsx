import "../styles/index.scss"
import React, { Fragment, Component } from 'react'
import { graphql, PageProps } from 'gatsby'
import Layout from '../components/Layout'

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(230,220,250,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      记录生活的美好时刻。
    </p>
  </div>
</section>

interface VideoProps {
  url: string,
  title: string,
  category: string
}

const Video = ({url, title, category}: VideoProps) => <article className="container content is-max-desktop" key={url}>
  <h2>{title}</h2>
  <div style={{position: "relative", padding: "30% 45%"}}>
    <iframe style={{position: "absolute", width: "100%", height: "100%", left: "0", top: "0"}} src={url + "&high_quality=1"} scrolling="no" data-border="0" data-frameborder="no" data-framespacing="0" data-allowfullscreen="true">
    </iframe>
  </div>
</article>

const Display = ({ nodes }: { nodes: VideoProps[] }) => <section className="section">
  {nodes.map(Video)}
</section>

// markup
const Videos = ({ data }: PageProps<Queries.VideosQuery>) => {
  const nodes: VideoProps[] = data.allNotionPage.nodes.map(({ title, properties }) => {
    return {
      title: title || "",
      category: properties?.Category || "",
      url: properties?.Bilibili_URL || ""
    }
  })
  return (
    <Layout slug="gallery">
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
  allNotionPage(
    filter: {parent: {id: {eq: "bfdb6803-c423-5398-90e1-cdfad5b3c484"}}}
  ) {
    nodes {
      title
      properties {
        Category
        Bilibili_URL
      }
    }
  }
}
`

export default Videos
