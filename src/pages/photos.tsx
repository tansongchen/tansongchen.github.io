import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(200,240,255,0.5), rgba(255,255,255,0.5))"}}>

</section>

const Gallery = () => <section>

</section>

const Photos = ({ data }) => {
  return (
    <Layout slug="photos">
      <Introduction />
      <Gallery />
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx {
      nodes {
        frontmatter {
          title
          date
        }
        slug
      }
    }
  }
`

export default Photos
