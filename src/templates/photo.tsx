import React from "react";
import { graphql, PageProps } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import slugify from "../utils/slugify";
import ExifImage, { IExifImage, preprocessExif } from "../components/ExifImage";
import EntryLayout from "../components/EntryLayout";
import { Photo } from "../utils/metadata";

export default function ({ data }: PageProps<Queries.PhotoQuery>) {
  const { title, properties, image } = data.notionPage!;
  const exif = preprocessExif(image!.childImageSharp!.fields!.exif!);
  const photo: Photo = {
    name: title!,
    date: exif.datetime,
    category: properties!.Category!,
    description: properties!.Description!,
    suite: properties!.Suite !== null ? properties!.Suite : undefined,
    exifImage: {
      image: image!.childImageSharp!
        .gatsbyImageData! as any as IGatsbyImageData,
      exif: exif,
    },
  };
  return (
    <EntryLayout art="photos" slug={slugify(photo.name)} {...photo}>
      <ExifImage {...photo.exifImage} alt={photo.name} />
    </EntryLayout>
  );
}

export const query = graphql`
  query Photo($id: String) {
    notionPage(id: { eq: $id }) {
      title
      properties {
        Category
        Description
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
`;
