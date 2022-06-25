import "../styles/index.scss"
import React, { Fragment, Component } from 'react'
import { graphql, PageProps } from 'gatsby'
import Layout from '../components/Layout'

const imageDomain = "https://cdn.jsdelivr.net/gh/tansongchen/images@master/";

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(200,240,230,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      一千人眼中有一千种风景，一千张照片背后有一千个故事。
    </p>
  </div>
</section>

interface PhotoData {
  caption: string,
  url: string,
  date: Date
}

interface PhotoProps extends PhotoData {
  active?: string,
  changeActive: (active?: string) => void,
}

const Preview = ({ date, url, caption, active, changeActive }: PhotoProps) => <figure className="box image is-128x128" style={{margin: ".8rem", padding: 0, cursor: "pointer", overflow: "auto"}} aria-haspopup="true" onClick={() => {changeActive(url)}} key={url}>
  <img src={url} alt={caption} />
</figure>

const format = (d: Date) => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`

const Modal = ({ date, url, caption, active, changeActive }: PhotoProps) =>
<div className={"modal" + (url === active ? " is-active" : "")} key={url}>
  <div className="modal-background"></div>
  <div className="modal-content content has-text-centered">
    <figure className="image">
      <img src={url} alt={caption} />
    </figure>
    <div style={{margin: "0 2rem"}}>
      <p style={{color: "#BBB"}}>
        {format(date)}
      </p>
      <div style={{color: "#DDD", fontSize: "125%"}}>{caption.split('\n').map(line => <p key={line}>{line}</p>)}</div>
    </div>
  </div>
  <button className="modal-close is-large" aria-label="close" onClick={() => changeActive(undefined)} />
</div>

interface GalleryProps { nodes: PhotoData[] }
interface GalleryState { active?: string }

interface MonthProps {
  year: number,
  month: number,
  photos: PhotoData[],
  active?: string,
  callback: (active?: string) => void,
}

const Month = ({ year, month, photos, active, callback }: MonthProps) => <div key={`${year} 年 ${month} 月`}>
  <article className="columns">
    <div className="column is-one-third has-text-centered">
      <div className="content">
        <h3 style={{margin: "1.5rem 0 .5rem 0"}}>{`${year} 年 ${month} 月`}</h3>
      </div>
    </div>
    <div className="column" style={{display: "flex", flexWrap: "wrap"}}>
      {photos.map(x => <Preview {...x} active={active} changeActive={callback} />)}
    </div>
  </article>
  <article>
    {photos.map(x => <Modal {...x} active={active} changeActive={callback} />)}
  </article>
</div>

class Gallery extends Component<GalleryProps, GalleryState> {
  state: GalleryState = {
    active: undefined
  }

  render() {
    let map = new Map<number, PhotoData[]>();
    this.props.nodes.sort((a, b) => (b.date.getTime() - a.date.getTime()));
    for (let photo of this.props.nodes) {
      let year = photo.date.getFullYear(), month = photo.date.getMonth() + 1;
      let key = year * 100 + month;
      map.set(key, (map.get(key) || []).concat([photo]))
    }
    const changeActive = (active?: string) => { this.setState({ active: active }) };
    let groups: MonthProps[] = [];
    for (let [key, value] of map.entries()) {
      groups.push({year: Math.floor(key / 100), month: key % 100, photos: value, active: this.state.active, callback: changeActive});
    }
    return <section className="section">
      <div className="container is-max-widescreen">
        {groups.map(Month)}
      </div>
    </section>
  }
}

const Photos = ({ data }: PageProps<Queries.PhotosQuery>) => {
  const nodes: PhotoData[] = data.allPhotosYaml.nodes.map(({ caption, date, url }) => ({caption: caption || "", date: new Date((new Date(date || "1970-01-01")).getTime() + 8 * 3600 * 1000), url: imageDomain + url}));
  return (
    <Layout slug="photos">
      <Introduction />
      <hr />
      <Gallery nodes={nodes} />
    </Layout>
  )
}

export const query = graphql`
  query Photos {
    allPhotosYaml {
      nodes {
        caption
        date
        url
      }
    }
  }
`

export default Photos
