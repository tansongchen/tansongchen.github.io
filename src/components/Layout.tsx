import Header from "./Header";
import Footer from "./Footer";
import Meta from "./Meta";
import React, { Component, Fragment } from "react";

interface LayoutProps {
  slug: string
}

class Layout extends Component<LayoutProps, object> {
  render() {
    return <Fragment>
      <Meta />
      <Header slug={this.props.slug}/>
      {this.props.children}
      <Footer />
    </Fragment>
  }
}

export default Layout
