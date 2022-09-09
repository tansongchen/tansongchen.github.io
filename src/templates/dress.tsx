import '../styles/index.scss';
import React, { Component } from 'react';
import { graphql, PageProps } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import Layout from '../components/Layout';
import slugify from '../utils/slugify';
import ExifImage, { IExifImage, preprocessExif } from '../components/ExifImage';
import Commenter from '../components/Commenter';

export default function ({ data }: PageProps<Queries.DressQuery>) {
  const { title, properties, image } = data.notionPage!;
  const exif = preprocessExif(image!.childImageSharp!.fields!.exif!);
  const {name, date, category, description, photographer, suite, exifImage} = {
    name: title!,
    date: exif.datetime,
    category: properties!.Category!,
    description: '',
    photographer: properties!.Photographer!,
    suite: properties!.Suite !== null ? properties!.Suite : undefined,
    exifImage: {
      image: image!.childImageSharp!.gatsbyImageData! as any as IGatsbyImageData,
      exif: exif
    }
  };
  return <Layout slug={`dresses/${slugify(name)}`}>
    <section className="section" style={{backgroundColor: "rgba(230, 240, 255, 0.5)"}}>
      <div className="content has-text-centered">
        <h2>{name}</h2>
        <p>
          <span key={category} className="tag is-medium is-info is-light">{category}</span>
        </p>
        <p>摄影师：{photographer}</p>
      </div>
    </section>
    <ExifImage {...exifImage} alt={name}/>
    <hr />
    <Commenter slug={`dresses/${slugify(name)}`}/>
  </Layout>
}

export const query = graphql`
  query Dress ($id: String) {
    notionPage(id: {eq: $id}) {
      title
      properties {
        Category
        Photographer
        Suite
      }
      image {
        childImageSharp {
          gatsbyImageData
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
`
