import React from "react";
import { Helmet } from "react-helmet";
import { title } from "../utils/metadata";

const Meta = () => <Helmet>
  <meta name="description" content="谭淞宸的个人网站" />
  <meta charSet="utf-8" />
  <title>{title}</title>
  <html lang="zh-Hans" />
  <body className="has-navbar-fixed-top" />
</Helmet>

export default Meta
