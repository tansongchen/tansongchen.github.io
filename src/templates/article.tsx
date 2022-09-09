import "../styles/index.scss";
import React, { Component } from 'react';
import { graphql, PageProps } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import Layout from '../components/Layout';
import Commenter from '../components/Commenter';
import { Helmet } from 'react-helmet';
import katex from 'katex';

export default class extends Component<PageProps<Queries.ArticleQuery>, object> {
  componentDidMount() {
    for (let display of document.getElementsByClassName("math-display")) {
      katex.render(display.textContent || "", display as HTMLElement, {throwOnError: false, displayMode: true});
    }
    for (let inline of document.getElementsByClassName("math-inline")) {
      katex.render(inline.textContent || "", inline as HTMLElement, {throwOnError: false});
    }
  }
  render() {
    const { title, date, tags } = this.props.data?.mdx?.frontmatter || {};
    const slug = this.props.data?.mdx?.slug || "articles/404";
    return (
        <Layout slug={slug}>
          <Helmet>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css" integrity="sha384-R4558gYOUz8mP9YWpZJjofhk+zx0AS11p36HnD2ZKj/6JR5z27gSSULCNHIRReVs" crossOrigin="anonymous" />
            {/* <script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js" integrity="sha384-z1fJDqw8ZApjGO3/unPWUPsIymfsJmyrDVWC8Tv/a1HeOtGmkwNd/7xUS0Xcnvsx" crossOrigin="anonymous"></script> */}
          </Helmet>
          <section className="section" style={{backgroundColor: "rgba(230, 240, 255, 0.5)"}}>
            <div className="content has-text-centered">
              <h2>{title || "Default Title"}</h2>
              <p>{date || "Default Date"}</p>
              <div className="tags" style={{justifyContent: "center"}}>
                {(tags || []).map(x => <span key={x} className="tag is-medium is-info">{x}</span>)}
              </div>
            </div>
          </section>
          <main className="section">
            <div className="container is-max-desktop content">
              <MDXRenderer>
                {this.props.data?.mdx?.body || ""}
              </MDXRenderer>
            </div>
          </main>
          <Commenter slug={slug} />
        </Layout>
    )
  }
}

export const query = graphql`
  query Article ($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        date(formatString: "YYYY 年 M 月 DD 日")
        tags
        abstract
        cover
      }
      slug
      body
    }
  }
`
