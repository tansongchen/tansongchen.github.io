import type { GatsbySSR } from "gatsby";

export const onRenderBody: GatsbySSR['onRenderBody'] = ({ setBodyAttributes }) => {
  setBodyAttributes({
    className: "has-navbar-fixed-top",
  })
}
