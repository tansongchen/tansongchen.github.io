import React from "react";

const Meta = ({ title }: { title: string} ) => <>
  <meta name="description" content="谭淞宸的个人网站" />
  <meta charSet="utf-8" />
  <title>{ title }</title>
  <html lang="zh-Hans" />
  <body className="has-navbar-fixed-top" />
</>

export default Meta;
