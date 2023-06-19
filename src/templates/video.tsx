import React from "react";
import { graphql, PageProps } from "gatsby";
import Layout from "../components/Layout";
import slugify from "../utils/slugify";
import Commenter from "../components/Commenter";
import { createDate, yymmdd } from "../utils/metadata";
import { Stream } from "@cloudflare/stream-react";

export default function ({ data }: PageProps<Queries.VideoQuery>) {
  const { title, properties } = data.notionPage!;
  const { Category, Description, Date, UID } = properties!;
  return (
    <Layout slug={`videos/${slugify(title!)}`}>
      <section
        className="section"
        style={{ backgroundColor: "rgba(230, 240, 255, 0.5)" }}
      >
        <div className="content has-text-centered">
          <h2>{title}</h2>
          <p>
            <span className="tag is-medium is-info is-light">{Category}</span>
          </p>
          <p>{Description!}</p>
          <p>{yymmdd(createDate(Date!.start!))}</p>
        </div>
      </section>
      <section className="section">
        <article className="container is-max-desktop">
          <div>
            <Stream controls src={UID!} />
          </div>
        </article>
      </section>
      <hr />
      <Commenter art="videos" slug={slugify(title!)} />
    </Layout>
  );
}

export const query = graphql`
  query Video($id: String) {
    notionPage(id: { eq: $id }) {
      title
      properties {
        Date {
          start
        }
        Category
        Description
        Suite
        UID
      }
    }
  }
`;
