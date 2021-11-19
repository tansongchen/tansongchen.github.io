import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'
import "katex/dist/katex.min.css";

const Article = ({ data }) => {
  const { title, date, tags, abstract, cover } = data.mdx.frontmatter;
  return (
    <Layout slug={data.mdx.slug}>
      <section className="section" style={{backgroundColor: "rgba(230, 240, 255, 0.5)"}}>
        <div className="content has-text-centered">
          <h2>{title}</h2>
          <p>{date}</p>
          <div className="tags" style={{justifyContent: "center"}}>
            {tags.map(x => <span key={x} className="tag is-medium is-info">{x}</span>)}
          </div>
        </div>
      </section>
      <main className="section container is-max-widescreen">
        <div className="column">
          <div className="content">
            <MDXRenderer>
              {data.mdx.body}
            </MDXRenderer>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
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

export default Article