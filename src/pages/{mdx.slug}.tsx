import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import Layout from '../components/Layout'

const Article = ({ data }) => {
  return (
    <Layout slug={data.mdx.slug}>
      <section className="section has-text-centered" style={{backgroundColor: "rgba(230, 240, 255, 0.5)"}}>
        <div style={{fontSize: "200%"}}>{data.mdx.frontmatter.title}</div>
        <p>{data.mdx.frontmatter.date}</p>
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
      }
      slug
      body
    }
  }
`

export default Article
