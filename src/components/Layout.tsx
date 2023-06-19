import Header from "./Header";
import Footer from "./Footer";
import React, { PropsWithChildren } from "react";

interface LayoutProps {
  slug: string;
}

export default function ({ slug, children }: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Header slug={slug} />
      {children}
      <Footer />
    </>
  );
}
