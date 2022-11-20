import React from "react";
import { graphql, PageProps, Link } from "gatsby";
import Layout from "../components/Layout";
import { Photo } from "../utils/metadata";
import { IExifImage, preprocessExif } from "../components/ExifImage";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import slugify from "../utils/slugify";
import Meta from "../components/Meta";

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(200,240,230,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      一千人眼中有一千种风景，一千张照片背后有一千个故事。
    </p>
  </div>
</section>

const Preview = ({ name, exifImage }: Photo) => <div className="box" style={{padding: 0, overflow: "hidden", zIndex: 0, position: "relative", margin: "2rem"}}>
  <Link to={slugify(name)}>
  <GatsbyImage image={exifImage.image} alt={name} />
  </Link>
</div>

interface GalleryProps { nodes: Photo[] }

const Gallery = ({ nodes }: GalleryProps) => {
  const map = new Map<string, Photo[]>();
  nodes.sort((a, b) => (b.date.getTime() - a.date.getTime()));
  return <section className="section" style={{paddingLeft: "0", paddingRight: "0"}}>
    <div className="container is-max-widescreen">
      {/* {groups.map(Category)} */}

    <div className="column" style={{display: "flex", flexWrap: "wrap", padding: "0", justifyContent: "center"}}>
      {nodes.map(x => <Preview {...x} />)}
    </div>
    </div>
  </section>
}

export default function({ data }: PageProps<Queries.PhotosQuery>) {
  const nodes: Photo[] = data.notionDatabase!.childrenNotionPage!.map(page => {
    const { title, properties, image } = page!;
    const exif = preprocessExif(image!.childImageSharp!.fields!.exif!);
    return {
      name: title!,
      date: exif.datetime,
      category: properties!.Category!,
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
          Description
          Suite
        }
        image {
          childImageSharp {
            gatsbyImageData(width: 300, height: 300)
            fields {
              exif {
                exif {
                  DateTimeOriginal
                  LensMake
                  LensModel
                  FocalLength
                  ISO
                  FNumber
                  ExposureTime
                  ExposureBiasValue
                }
                image {
                  Make
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

// export const Head = () => <Meta title="照片"/>
