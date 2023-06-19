import React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "../components/Layout";
import Commenter from "../components/Commenter";
import Meta from "../components/Meta";
import { basename } from "../utils/metadata";

export default function ({ data }: PageProps<Queries.ArticleQuery>) {
  const { fileAbsolutePath, frontmatter, html } = data.markdownRemark || {
    fileAbsolutePath: "",
    frontmatter: {},
    html: "",
  };
  const { title, date, tags } = frontmatter || {};
  const slug = basename(fileAbsolutePath || "");
  return (
    <Layout slug={`articles/${slug}`}>
      <section
        className="section"
        style={{ backgroundColor: "rgba(230, 240, 255, 0.5)" }}
      >
        <div className="content has-text-centered">
          <h2>{title || "Default Title"}</h2>
          <p>{date || "Default Date"}</p>
          <div className="tags" style={{ justifyContent: "center" }}>
            {(tags || []).map((x) => (
              <span key={x} className="tag is-medium is-info">
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>
      <main className="section">
        <div
          className="container is-max-desktop content"
          dangerouslySetInnerHTML={{ __html: html || "" }}
        ></div>
      </main>
      <Commenter art={"articles"} slug={slug} />
    </Layout>
  );
}

export const query = graphql`
  query Article($id: String!) {
    markdownRemark(id: { eq: $id }) {
      fileAbsolutePath
      frontmatter {
        title
        date(formatString: "YYYY 年 M 月 DD 日")
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
