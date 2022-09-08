import '../styles/index.scss';
import React, { Component } from 'react';
import { graphql, PageProps } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import Layout from '../components/Layout';
import slugify from '../utils/slugify';
import ExifImage, { IExifImage, preprocessExif } from '../components/ExifImage';
import Commenter from '../components/Commenter';

export default function ({ data }: PageProps<Queries.PhotoQuery>) {
  const { title, properties, image } = data.notionPage!;
  const exif = preprocessExif(image!.childImageSharp!.fields!.exif!);
  const { name, date, category, tags, description, suite, exifImage } = {
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
  };
  return <Layout slug={`photos/${slugify(name)}`}>
    <section className="section" style={{backgroundColor: "rgba(230, 240, 255, 0.5)"}}>
      <div className="content has-text-centered">
        <h2>{name}</h2>
        <p>
          <span key={category} className="tag is-medium is-info is-light">{category}</span>
        </p>
        <p>{description}</p>
        {/* <div className="tags" style={{justifyContent: "center"}}>
          {(tags || []).map(x => <span key={x} className="tag is-medium is-info">{x}</span>)}
        </div> */}
      </div>
    </section>
    <ExifImage {...exifImage} alt={name}/>
    <hr />
    <Commenter slug={`photos/${slugify(name)}`}/>
  </Layout>
}

export const query = graphql`
  query Photo ($id: String) {
    notionPage(id: {eq: $id}) {
      title
      properties {
        Category
        Description
        Tags
        Suite
      }
      image {
        childImageSharp {
          gatsbyImageData
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
`
