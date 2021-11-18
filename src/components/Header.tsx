import { Link } from "gatsby"
import React, {Component, Fragment} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCode, faHome, faPen, faPhotoVideo, faPortrait, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { Helmet } from "react-helmet"
import summary from "../utils/metadata"

interface NavItemProps {
  icon: IconDefinition,
  name: string,
  slug: string,
  current: string,
}

const NavItem = ({icon, name, slug, current}: NavItemProps) => <Link to={`/${slug}/`.replace('//', '/')} key={slug} className={"navbar-item" + (slug === current ? " navbar-item-current" : "")}>
  <FontAwesomeIcon icon={icon} className="icon is-small"/>
  <span>&nbsp;&nbsp;{name}</span>
</Link>

interface NavProps { slug: string }
interface NavState { expand: boolean }

class Nav extends Component<NavProps, NavState> {
  state: NavState = {
    expand: false
  }

  render() {
    return <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div className="content is-medium container">
        <div className="navbar-brand">
          <a className="navbar-item" style={{fontSize: "1.5rem", padding: "0 1.5rem"}} href="/">
            🍭️ 淞宸奇妙屋&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </a>

          <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={() => { this.setState({ expand: !this.state.expand }) }}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className={this.state.expand ? "navbar-menu is-active" : "navbar-menu"}>
          <div className="navbar-start" style={{justifyContent: "center", marginLeft: "auto"}}>
            {summary.map(x => <NavItem {...x} current={this.props.slug} />)}
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-info">
                  <strong>订阅</strong>
                </a>
                {/* <a className="button is-light">
                  Log in
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
  </nav>
  }
}

const Header = ({slug}) => <Fragment>
  <Helmet>
    <meta charSet="utf-8" />
    <title>淞宸奇妙屋</title>
    <body className="has-navbar-fixed-top" />
  </Helmet>
  <Nav slug={slug}>
  </Nav>
</Fragment>

export default Header
