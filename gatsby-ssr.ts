import type { GatsbySSR } from "gatsby";

export const onRenderBody: GatsbySSR['onRenderBody'] = ({ setBodyAttributes, setHtmlAttributes }) => {
  setBodyAttributes({
    className: "has-navbar-fixed-top",
  });
  setHtmlAttributes({
    lang: 'zh-Hans',
  });
}
