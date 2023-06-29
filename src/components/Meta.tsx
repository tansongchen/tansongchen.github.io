import React from "react";

const Meta = ({ title }: { title: string }) => (
  <>
    <meta name="description" content="谭淞宸的个人网站" />
    <meta charSet="utf-8" />
    <link
      rel="webmention"
      href="https://webmention.io/tansongchen.com/webmention"
    />
    <link rel="pingback" href="https://webmention.io/tansongchen.com/xmlrpc" />
    <title>{title}</title>
  </>
);

export default Meta;
