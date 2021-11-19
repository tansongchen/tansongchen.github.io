import React, { Fragment, Component } from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(200,240,230,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      一千人眼中有一千种风景，一千张照片背后有一千个故事。
    </p>
  </div>
</section>

interface PhotoProps {
  caption: string,
  url: string,
  date: Date,
  active: string,
  changeActive: (active: string) => void,
}

const Preview = ({ date, url, caption, active, changeActive }: PhotoProps) => <figure className="box image is-128x128" style={{margin: ".8rem", padding: 0, cursor: "pointer", overflow: "auto"}} aria-haspopup="true" onClick={() => {changeActive(url)}}>
  <img src={url} alt={caption} />
</figure>

const format = (d: Date) => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`

const Modal = ({ date, url, caption, active, changeActive }: PhotoProps) =>
<div className={"modal" + (url === active ? " is-active" : "")}>
  <div className="modal-background"></div>
  <div className="modal-content content has-text-centered">
    <figure className="image">
      <img src={url} alt={caption} />
    </figure>
    <p style={{color: "#BBB"}}>
      {format(date)}
    </p>
    <p style={{color: "#DDD", fontSize: "125%", whiteSpace: "pre"}}>{caption}</p>
  </div>
  <button className="modal-close is-large" aria-label="close" onClick={() => changeActive(undefined)} />
</div>

interface GalleryProps { nodes: PhotoProps[] }
interface GalleryState { active: string }

interface MonthProps {
  year: number,
  month: number,
  photos: PhotoProps[],
  active: string,
  callback: (active: string) => void,
}

const Month = ({ year, month, photos, active, callback }: MonthProps) => <Fragment>
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
</Fragment>

class Gallery extends Component<GalleryProps, GalleryState> {
  state: GalleryState = {
    active: undefined
  }

  render() {
    let map = new Map<number, PhotoProps[]>();
    this.props.nodes.sort((a, b) => (b.date.getTime() - a.date.getTime()));
    for (let photo of this.props.nodes) {
      let year = photo.date.getFullYear(), month = photo.date.getMonth() + 1;
      let key = year * 100 + month;
      map.set(key, (map.get(key) || []).concat([photo]))
    }
    const changeActive = (active: string) => { this.setState({ active: active }) };
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

const Photos = ({ data }) => {
  const preprocess = ({ caption, date, url }) => ({caption: caption, date: new Date(date), url: url});
  const nodes: PhotoProps[] = data.allPhotosYaml.nodes.map(preprocess);
  return (
    <Layout slug="photos">
      <Introduction />
      <hr />
      <Gallery nodes={nodes} />
    </Layout>
  )
}

export const query = graphql`
  query {
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