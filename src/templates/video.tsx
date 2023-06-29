import React from "react";
import { graphql, PageProps } from "gatsby";
import slugify from "../utils/slugify";
import { createDate, Video, yymmdd } from "../utils/metadata";
import { Stream } from "@cloudflare/stream-react";
import EntryLayout from "../components/EntryLayout";
import Meta from "../components/Meta";

export default function ({ data }: PageProps<Queries.VideoQuery>) {
  const { title, properties } = data.notionPage!;
  const { Category, Description, Date, UID } = properties!;
  const video: Video = {
    name: title!,
    date: createDate(Date!.start!),
    category: Category!,
    description: Description!,
    uid: UID!,
  };
  return (
    <EntryLayout art="videos" slug={slugify(video.name)} {...video}>
      <section className="section e-content">
        <article className="container is-max-desktop">
          <div>
            <Stream controls src={UID!} />
          </div>
        </article>
      </section>
    </EntryLayout>
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

export const Head = ({ data }: { data: any }) => (
  <Meta title={data.notionPage.title} />
);
