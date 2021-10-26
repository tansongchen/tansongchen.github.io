import { Link } from "gatsby";
import React from "react"

const Contact = () => <section>
  <a href="tel:+18572989702">+1 (857) 298-9702</a>
  <a href="mailto:songchen@mit.edu">songchen@mit.edu</a>
  <a href="https://maps.google.com/maps?ll=42.361941,-71.090438&z=15&t=m&hl=en-US&gl=US&mapclient=embed&cid=3475329887376826349">32 Vassar Street
  Cambridge, MA 02139
  </a>
</section>

const Copyright = () => <section>
  © 谭淞宸 2017 - 2021
  网页代码以 <a href="https://opensource.org/licenses/mit-license.php">MIT</a> 协议发布
  网页内容以 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> 协议发布
</section>

const Footer = ({current}) => <footer>
  <Contact />
  <Copyright />
</footer>

export default Footer;
