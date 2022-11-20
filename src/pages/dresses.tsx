import React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import Layout from "../components/Layout";
import { Dress } from "../utils/metadata";
import ExifImage, { IExifImage, preprocessExif } from "../components/ExifImage";
import slugify from "../utils/slugify";
import Meta from "../components/Meta";

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(200,250,250,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      我想成为美少女！！！
    </p>
    <p>
      本页面正在建设中，过一段时间回来看看会发现更多内容哦～
    </p>
  </div>
</section>

const DressDigest = ({exifImage, name}: Dress) => {
  return <Link to={slugify(name)} key={name}>
    <GatsbyImage image={exifImage.image} alt={name}/>
  </Link>
}

const Category = ({name, data}: {name: string, data: Dress[]}) => {
  return <article className="columns" key={name}>
    <div className="column is-one-quarter has-text-centered">
      <div className="content">
        <h3 style={{margin: "1.5rem 0 .5rem 0"}}>{name}</h3>
      </div>
    </div>
    <div className="column" style={{display: "flex", flexWrap: "wrap", justifyContent: "center", padding: 0}}>
      {data.map(DressDigest)}
    </div>
  </article>
}

const Main = ({nodes}: {nodes: Dress[]}) => {
  const map = new Map<string, Dress[]>();
  for (const dress of nodes) {
    map.set(dress.category, (map.get(dress.category) || []).concat([dress]));
  }
  const groups: {name: string, data: Dress[]}[] = [{name: "Lolita", data: map.get("Lolita")!}];
  return <section className="section">
    {
      groups.map(Category)
    }
  </section>
}

export default function({ data }: PageProps<Queries.DressesQuery>) {
  const nodes: Dress[] = data.notionDatabase!.childrenNotionPage!.map(page => {
    const { title, properties, image } = page!;
    const exif = preprocessExif(image!.childImageSharp!.fields!.exif!);
    return {
      name: title!,
      date: exif.datetime,
      category: properties!.Category!,
      description: properties!.Description!,
      photographer: properties!.Photographer!,
      suite: properties!.Suite !== null ? properties!.Suite : undefined,
      exifImage: {
        image: image!.childImageSharp!.gatsbyImageData! as any as IGatsbyImageData,
        exif: exif
      }
    }
  });
  return (
    <Layout slug="dresses">
      <Introduction />
      <hr />
      <Main nodes={nodes}/>
    </Layout>
  )
}

export const query = graphql`
  query Dresses {
    notionDatabase(title: {eq: "女装"}) {
      childrenNotionPage {
        title
        properties {
          Category
          Photographer
          Suite
          Description
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

// export const Head = () => <Meta title="女装"/>
