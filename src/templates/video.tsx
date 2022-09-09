import '../styles/index.scss';
import React, { Component } from 'react';
import { graphql, PageProps } from 'gatsby';
import Layout from '../components/Layout';
import slugify from '../utils/slugify';
import Commenter from '../components/Commenter';
import { yymmdd } from '../utils/metadata';

export default function ({ data }: PageProps<Queries.VideoQuery>) {
  const { title, properties } = data.notionPage!;
  return <Layout slug={`videos/${slugify(title!)}`}>
    <section className="section" style={{backgroundColor: "rgba(230, 240, 255, 0.5)"}}>
      <div className="content has-text-centered">
        <h2>{title}</h2>
        <p>
          <span className="tag is-medium is-info is-light">{properties!.Category}</span>
        </p>
        <p>{properties!.Description!}</p>
        <p>
          {yymmdd(new Date(properties!.Date!.start!))}
        </p>
      </div>
    </section>
    <section className='section'>
      <article className='container is-max-desktop'>
        <div style={{position: "relative", padding: "30% 45%"}}>
          <iframe style={{position: "absolute", width: "100%", height: "100%", left: "0", top: "0"}} src={properties!.Bilibili_URL + "&high_quality=1"} scrolling="no" data-border="0" data-frameborder="no" data-framespacing="0" data-allowfullscreen="true">
          </iframe>
        </div>
      </article>
    </section>
    <hr />
    <Commenter slug={`photos/${slugify(title!)}`}/>
  </Layout>
}

export const query = graphql`
  query Video ($id: String) {
    notionPage(id: {eq: $id}) {
      title
      properties {
        Date {
          start
        }
        Category
        Description
        Tags
        Suite
        Bilibili_URL
      }
    }
  }
`
