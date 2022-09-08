import "../styles/index.scss";
import React, { Component } from 'react';
import { graphql, PageProps } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/Layout';
import slugify from '../utils/slugify';

export default function ({ data }: PageProps<Queries.RecipeQuery>) {
  const { title, properties, childMdx } = data.notionPage || {};
  return (
      <Layout slug={`cuisine/${slugify(title!)}`}>
        <section className="section" style={{backgroundColor: "rgba(230, 240, 255, 0.5)"}}>
          <div className="content has-text-centered">
            <h2>{title || "菜名"}</h2>
            <p>{properties?.Rating || "⭐️️⭐️️⭐️️⭐️️"}</p>
            <div className="tags" style={{justifyContent: "center"}}>
              {<span className="tag is-medium is-info">{properties?.Category || "其他"}</span>}
            </div>
          </div>
        </section>
        <main className="section">
          <div className="container is-max-desktop content">
            <MDXRenderer>
              {childMdx?.body || ""}
            </MDXRenderer>
          </div>
        </main>
      </Layout>
  )
}

export const query = graphql`
  query Recipe ($id: String) {
    notionPage(id: {eq: $id}) {
      title
      properties {
        Category
        Rating
      }
      childMdx {
        body
      }
    }
  }
`
