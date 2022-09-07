import "../styles/index.scss"
import React, { Fragment, Component } from 'react'
import { graphql, PageProps } from 'gatsby'
import Layout from '../components/Layout'
import { Piece } from "../utils/types";
import { IExifImage, preprocessExif } from "../components/ExifImage";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";

interface IPhoto extends Piece {
  exifImage: IExifImage
}

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(200,240,230,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      一千人眼中有一千种风景，一千张照片背后有一千个故事。
    </p>
  </div>
</section>

interface PhotoProps extends IPhoto {
  active?: string,
  changeActive: (active?: string) => void,
}

const Preview = ({ name, date, description, exifImage, active, changeActive }: PhotoProps) => <GatsbyImage image={exifImage.image} alt={name} aria-haspopup="true" onClick={() => {changeActive(name)}}/>

const format = (d: Date) => `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`

// const Modal = ({ date, description, active, changeActive }: PhotoProps) =>
// <div className={"modal" + (url === active ? " is-active" : "")} key={url}>
//   <div className="modal-background"></div>
//   <div className="modal-content content has-text-centered">
//     <figure className="image">
//       <img src={url} alt={caption} />
//     </figure>
//     <div style={{margin: "0 2rem"}}>
//       <p style={{color: "#BBB"}}>
//         {format(date)}
//       </p>
//       <div style={{color: "#DDD", fontSize: "125%"}}>{caption.split('\n').map(line => <p key={line}>{line}</p>)}</div>
//     </div>
//   </div>
//   <button className="modal-close is-large" aria-label="close" onClick={() => changeActive(undefined)} />
// </div>

interface GalleryProps { nodes: IPhoto[] }
interface GalleryState { active?: string }

interface MonthProps {
  category: string,
  photos: IPhoto[],
  active?: string,
  callback: (active?: string) => void,
}

const Category = ({ category, photos, active, callback }: MonthProps) => <div key={category}>
  <article className="columns">
    <div className="column is-one-third has-text-centered">
      <div className="content">
        <h3 style={{margin: "1.5rem 0 .5rem 0"}}>{category}</h3>
      </div>
    </div>
    <div className="column" style={{display: "flex", flexWrap: "wrap"}}>
      {photos.map(x => <Preview {...x} active={active} changeActive={callback} />)}
    </div>
  </article>
  {/* <article>
    {photos.map(x => <Modal {...x} active={active} changeActive={callback} />)}
  </article> */}
</div>

class Gallery extends Component<GalleryProps, GalleryState> {
  state: GalleryState = {
    active: undefined
  }

  render() {
    const map = new Map<string, IPhoto[]>();
    this.props.nodes.sort((a, b) => (b.date.getTime() - a.date.getTime()));
    for (const photo of this.props.nodes) {
      const key = photo.category;
      map.set(key, (map.get(key) || []).concat([photo]))
    }
    const changeActive = (active?: string) => { this.setState({ active: active }) };
    let groups: MonthProps[] = [];
    for (let [key, value] of map.entries()) {
      groups.push({category: key, photos: value, active: this.state.active, callback: changeActive});
    }
    return <section className="section">
      <div className="container is-max-widescreen">
        {groups.map(Category)}
      </div>
    </section>
  }
}

export default function({ data }: PageProps<Queries.PhotosQuery>) {
  const nodes: IPhoto[] = data.notionDatabase!.childrenNotionPage!.map(page => {
    const { title, properties, image } = page!;
    const exif = preprocessExif(image!.childImageSharp!.fields!.exif!);
    return {
      name: title!,
      date: exif.datetime,
      category: properties!.Category!,
      tags: properties!.Tags!.map(s => s || "").filter(s => s),
      description: properties!.Description!,
      suite: properties!.Suite !== null ? properties!.Suite : undefined,
      exifImage: {
        image: image!.childImageSharp!.gatsbyImageData! as any as IGatsbyImageData,
        exif: exif
      }
    }
  });
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
    notionDatabase(title: {eq: "照片"}) {
      childrenNotionPage {
        title
        properties {
          Category
          Tags
          Description
          Suite
        }
        image {
          childImageSharp {
            gatsbyImageData(width: 300, height: 300, placeholder: BLURRED, formats: [AUTO, WEBP])
            fields {
              exif {
                exif {
                  DateTimeOriginal
                  LensModel
                  FocalLength
                  ISO
                  FNumber
                  ExposureTime
                  ExposureBiasValue
                }
                image {
                  Model
                }
                gps {
                  GPSLatitudeRef
                  GPSLatitude
                  GPSLongitudeRef
                  GPSLongitude
                }
              }
            }
          }
        }
      }
    }
  }
`
