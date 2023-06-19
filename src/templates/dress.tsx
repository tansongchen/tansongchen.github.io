import React from "react";
import { graphql, PageProps } from "gatsby";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import slugify from "../utils/slugify";
import ExifImage, { IExifImage, preprocessExif } from "../components/ExifImage";
import EntryLayout from "../components/EntryLayout";
import { Dress } from "../utils/metadata";

export default function ({ data }: PageProps<Queries.DressQuery>) {
  const { title, properties, image } = data.notionPage!;
  const exif = preprocessExif(image!.childImageSharp!.fields!.exif!);
  const dress: Dress =
    {
      name: title!,
      date: exif.datetime,
      category: properties!.Category!,
      description: "",
      photographer: properties!.Photographer!,
      suite: properties!.Suite !== null ? properties!.Suite : undefined,
      exifImage: {
        image: image!.childImageSharp!
          .gatsbyImageData! as any as IGatsbyImageData,
        exif: exif,
      },
    };
  return (
    <EntryLayout art="dresses" slug={slugify(dress.name)} {...dress}>
      <div className="e-content">
        <ExifImage {...dress.exifImage} alt={dress.name} />
      </div>
    </EntryLayout>
  );
}

export const query = graphql`
  query Dress($id: String) {
    notionPage(id: { eq: $id }) {
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
`;
