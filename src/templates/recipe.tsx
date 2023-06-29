import React from "react";
import { graphql, PageProps } from "gatsby";
import slugify from "../utils/slugify";
import { createDate, Recipe, yymmdd } from "../utils/metadata";
import EntryLayout from "../components/EntryLayout";
import Meta from "../components/Meta";

export default function ({ data }: PageProps<Queries.RecipeQuery>) {
  const { title, properties, childMarkdownRemark, image } = data.notionPage!;
  const date = createDate(
    image!.childImageSharp!.fields!.exif!.exif!.DateTimeOriginal!
  );
  const recipe: Recipe = {
    name: title!,
    date: date,
    category: properties!.Category!,
    rating: properties!.Rating!,
    description: "",
  };
  return (
    <EntryLayout art="cuisine" slug={slugify(recipe.name)} {...recipe}>
      <section className="section e-content">
        <article
          className="container is-max-desktop content"
          dangerouslySetInnerHTML={{ __html: childMarkdownRemark!.html! }}
        ></article>
      </section>
    </EntryLayout>
  );
}

export const query = graphql`
  query Recipe($id: String) {
    notionPage(id: { eq: $id }) {
      title
      properties {
        Category
        Rating
      }
      childMarkdownRemark {
        html
      }
      image {
        childImageSharp {
          fields {
            exif {
              exif {
                DateTimeOriginal
              }
            }
          }
        }
      }
    }
  }
`;

export const Head = ({ data }: { data: any }) => (
  <Meta title={data.notionPage.title} />
);
