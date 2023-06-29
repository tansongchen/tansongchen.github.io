import React, { PropsWithChildren } from "react";
import Layout from "./Layout";
import Commenter from "./Commenter";
import WebMention from "./WebMention";

export default function ({
  slug,
  children,
}: PropsWithChildren<{ slug: string }>) {
  return (
    <Layout slug={slug}>
      {children}
      <hr />
      <Commenter art={slug} slug={""} />
      <hr />
      <WebMention art={slug} slug={""} />
    </Layout>
  );
}
