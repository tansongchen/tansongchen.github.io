import { Link } from "gatsby"
import React from "react"

const Logo = () => <div className="navbar-brand">
  <Link to="/">谭淞宸</Link>
</div>

const Nav = () => <nav className="navbar">
  <Link to="/">主页</Link>
  <Link to="/about/">关于</Link>
  <Link to="/articles/">文章</Link>
</nav>

const Header = ({current}) => <header>
  <Logo />
  <Nav />
</header>

export default Header
