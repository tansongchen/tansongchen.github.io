import React, { PropsWithChildren } from "react";
import Layout from "./Layout";
import Commenter from "./Commenter";
import { Piece, site, yymmdd } from "../utils/metadata";

export default function ({
  art,
  slug,
  name,
  date,
  category,
  description,
  children,
}: PropsWithChildren<{ art: string, slug: string } & Piece>) {
  const path = art + "/" + slug;
  const url = site + "/" + path;
  return (
    <Layout slug={path}>
      <main className="h-entry">
        <section
          className="section"
          style={{ backgroundColor: "rgba(230, 240, 255, 0.5)" }}
        >
          <div className="content has-text-centered">
            <h2 className="p-name">{name}</h2>
            <a className="p-author h-card" href="https://tansongchen.com" style={{display: "none"}}>谭淞宸</a>
            <a className="u-url" href={url} style={{display: "none"}}></a>
            <p>
              <span className="tag is-medium is-info is-light p-category">{category}</span>
            </p>
            <p className="p-summary">{description}</p>
            <p>
              <time className="dt-published" dateTime={date.toISOString()}>{yymmdd(date)}</time>
            </p>
          </div>
        </section>
        {children}
      </main>
      <hr />
      <Commenter art={art} slug={slug} />
    </Layout>
  );
}
