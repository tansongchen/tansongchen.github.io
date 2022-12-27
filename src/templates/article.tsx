import React, { Component } from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "../components/Layout";
import Commenter from "../components/Commenter";
import { MDXRenderer } from "gatsby-plugin-mdx";
import katex from "katex";
import Meta from "../components/Meta";

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
    const [art, _slug] = slug.split('/');
    return <Layout slug={slug}>
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
      <Commenter art={art} slug={_slug} />
    </Layout>
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

export const Head = ({
  data: {
    mdx: {
      frontmatter: { title }
    }
  }
}: { data: { mdx: { frontmatter: { title: string }}}}) => {
  return <>
    <Meta title={title} />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.3/dist/katex.min.css" integrity="sha384-Juol1FqnotbkyZUT5Z7gUPjQ9gzlwCENvUZTpQBAPxtusdwFLRy382PSDx5UUJ4/" crossOrigin="anonymous" />
  </>;
};
