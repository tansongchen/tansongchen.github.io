import { Link } from "gatsby";
import React from "react"
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Contact = () => <section className="column has-text-centered content">
  <div className="content is-medium">联系方式</div>
  <a href="tel:+18572989702">
    <FontAwesomeIcon icon={faPhone} className="icon is-small"/>
    &nbsp;&nbsp;+1 (857) 298-9702
  </a>
  <br />
  <a href="mailto:songchen@mit.edu">
    <FontAwesomeIcon icon={faEnvelope} className="icon is-small"/>
    &nbsp;&nbsp;songchen@mit.edu
  </a>
</section>

const Address = () => <section className="column has-text-centered content">
  <div className="content is-medium">地址</div>
  <a href="https://maps.google.com/maps?ll=42.361941,-71.090438&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=3475329887376826349">
    Gates Building Room 758
    <br />
    32 Vassar Street
    <br />
    Cambridge, MA 02139
  </a>
</section>

const Copyright = () => <section className="column has-text-centered content">
  <div className="content is-medium">谭淞宸 © 2017 - 2021</div>
  网页代码以 <a href="https://opensource.org/licenses/mit-license.php">MIT</a> 协议发布
  <br />
  内容以 <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> 协议发布
</section>

const Footer = () => <footer className="footer">
  <div className="container">
    <div className="columns">
      <Copyright />
      <Contact />
      <Address />
    </div>
  </div>
</footer>

export default Footer;
