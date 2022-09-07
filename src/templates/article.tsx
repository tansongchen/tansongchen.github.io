import "../styles/index.scss"
import React, { Component } from 'react'
import { graphql, PageProps } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import Commenter from '../components/Commenter';
import { Helmet } from 'react-helmet';
import katex from 'katex';
import slugify from "../utils/slugify";
import { yymmdd } from "../utils/metadata";

export default class Article extends Component<PageProps<Queries.ArticleQuery>, object> {
  componentDidMount() {
    for (let display of document.getElementsByClassName("math-display")) {
      katex.render(display.textContent || "", display as HTMLElement, {throwOnError: false, displayMode: true});
    }
    for (let inline of document.getElementsByClassName("math-inline")) {
      katex.render(inline.textContent || "", inline as HTMLElement, {throwOnError: false});
    }
  }
  render() {
    const { title, properties, childMdx } = this.props.data!.notionPage!;
    return (
        <Layout slug={slugify(title!)}>
          <Helmet>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css" integrity="sha384-R4558gYOUz8mP9YWpZJjofhk+zx0AS11p36HnD2ZKj/6JR5z27gSSULCNHIRReVs" crossOrigin="anonymous" />
            {/* <script defer src="https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js" integrity="sha384-z1fJDqw8ZApjGO3/unPWUPsIymfsJmyrDVWC8Tv/a1HeOtGmkwNd/7xUS0Xcnvsx" crossOrigin="anonymous"></script> */}
          </Helmet>
          <section className="section" style={{backgroundColor: "rgba(230, 240, 255, 0.5)"}}>
            <div className="content has-text-centered">
              <h2>{title || "Default Title"}</h2>
              <p>{yymmdd(new Date(properties!.Date!.start!))}</p>
              <div className="tags" style={{justifyContent: "center"}}>
                {([properties!.Category] || []).map(x => <span key={x} className="tag is-medium is-info">{x}</span>)}
              </div>
            </div>
          </section>
          <main className="section">
            <div className="container is-max-desktop content">
              <MDXRenderer>
                {childMdx!.body}
              </MDXRenderer>
            </div>
          </main>
          <Commenter slug={slugify(title!)} />
        </Layout>
    )
  }
}

export const query = graphql`
  query Article ($id: String) {
    notionPage(id: {eq: $id}) {
      title
      properties {
        Date {
          start
        }
        Category
        Tags
      }
      childMdx {
        body
      }
    }
  }
`
