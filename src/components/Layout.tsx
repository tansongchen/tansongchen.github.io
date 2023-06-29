import Header from "./Header";
import Footer from "./Footer";
import React, { PropsWithChildren } from "react";

export default function ({
  slug,
  children,
}: PropsWithChildren<{ slug: string }>) {
  return (
    <>
      <Header slug={slug} />
      {children}
      <Footer />
    </>
  );
}
