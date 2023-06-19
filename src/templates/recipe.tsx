import React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "../components/Layout";
import slugify from "../utils/slugify";
import { createDate, yymmdd } from "../utils/metadata";
import Commenter from "../components/Commenter";

export default function ({ data }: PageProps<Queries.RecipeQuery>) {
  const { title, properties, childMarkdownRemark, image } = data.notionPage!;
  const date = createDate(
    image!.childImageSharp!.fields!.exif!.exif!.DateTimeOriginal!
  );
  return (
    <Layout slug={`cuisine/${slugify(title!)}`}>
      <section
        className="section"
        style={{ backgroundColor: "rgba(230, 240, 255, 0.5)" }}
      >
        <div className="content has-text-centered">
          <h2>{title!}</h2>
          <p>{properties!.Rating!}</p>
          <p>{yymmdd(date)}</p>
          <div className="tags" style={{ justifyContent: "center" }}>
            {
              <span className="tag is-medium is-info">
                {properties!.Category!}
              </span>
            }
          </div>
        </div>
      </section>
      <main className="section">
        <div
          className="container is-max-desktop content"
          dangerouslySetInnerHTML={{ __html: childMarkdownRemark!.html! }}
        ></div>
      </main>
      <Commenter art="recipes" slug={slugify(title!)} />
    </Layout>
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
