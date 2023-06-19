import React from "react";
import { graphql, PageProps } from "gatsby";
import Meta from "../components/Meta";
import { Article, basename } from "../utils/metadata";
import EntryLayout from "../components/EntryLayout";

export default function ({ data }: PageProps<Queries.ArticleQuery>) {
  const { fileAbsolutePath, frontmatter, html } = data.markdownRemark || {
    fileAbsolutePath: "",
    frontmatter: {},
    html: "",
  };
  const { title, date, tags, abstract, cover } = frontmatter || {};
  const slug = basename(fileAbsolutePath || "");
  const article: Article = {
    name: title || "Default Title",
    date: new Date(date || "Default Date"),
    category: tags![0] || "Default Category",
    description: abstract || "Default Description",
    cover: cover || "",
  }
  return (
    <EntryLayout art="articles" slug={slug} {...article}>
      <section className="section e-content">
        <article
          className="container is-max-desktop content"
          dangerouslySetInnerHTML={{ __html: html || "" }}
        ></article>
      </section>
    </EntryLayout>
  );
}

export const query = graphql`
  query Article($id: String!) {
    markdownRemark(id: { eq: $id }) {
      fileAbsolutePath
      frontmatter {
        title
        date
        tags
        abstract
        cover
      }
      html
    }
  }
`;

export const Head = ({ data }: { data: any }) => {
  return (
    <>
      <Meta title={data.markdownRemark.frontmatter.title} />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.3/dist/katex.min.css"
        integrity="sha384-Juol1FqnotbkyZUT5Z7gUPjQ9gzlwCENvUZTpQBAPxtusdwFLRy382PSDx5UUJ4/"
        crossOrigin="anonymous"
      />
    </>
  );
};
