import "../styles/index.scss";
import React, { Fragment, ReactElement } from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Layout from "../components/Layout";
import summary, { title, Page } from "../utils/metadata";

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(200,240,255,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container is-max-widescreen">
    <div className="columns is-vcentered">
      <div className="column is-one-third" style={{padding: "3rem"}}>
        <StaticImage src="../images/mitao.gif" alt="avatar"/>
      </div>
      <div className="column content" style={{padding: "5%", fontSize: "125%"}}>
        <p>
          欢迎来到我的个人网站！我是谭淞宸。
        </p>
        <p>
          1974 年，Internet 一词第一次出现在 RFC 提案中，标志着世界各地的小型网络走向互联。1987 年 9 月 14 日，北京计算机应用技术研究所发出了中国第一封电子邮件：「<i>Across the Great Wall we can reach every corner in the world.</i>」。几十年后的今天，商业化的互联网中我们接收到的绝大多数信息来自科技公司的整合与推送，但是我们仍然可以以个人网站的形式保留并发出自己独立的声音。
        </p>
        <p>
          我自诩为一位创造者，凡是将人类的心智外化于物、创造出本不属于这个世界的实体从而实现自我的活动都令我兴致勃勃，写文章、敲代码、玩音乐、拍视频……我想自古以来的文人墨客都要给自己的书斋、画室起个名号，我也不能免俗地依志趣把这个网站称作「<span>{title}</span>」。下面列出了本站的几个版块，更多的版块也会慢慢上线；您也可以在导航栏中发现它们。祝您浏览愉快！
        </p>
      </div>
    </div>
  </div>
</section>

const Summary = ({ slug, image, name, description }: Page) => <Link to={`/${slug}/`} key={slug}>
  <div className="column" style={{margin: "1rem", justifyContent: "center"}} key={slug}>
    <div className="card" style={{width: 300, margin: "auto"}}>
      <div className="card-image">
        <figure className="image">
          {image}
        </figure>
      </div>
      <div className="card-content content">
        <h3>{name}</h3>
        <p>
          {description}
        </p>
      </div>
    </div>
  </div>
</Link>

const Overview = () => <section className="section container">
  <div className="columns" style={{flexWrap: "wrap", justifyContent: "center"}}>
    {summary.map(Summary)}
  </div>
</section>

export default function() {
  return <Layout slug="">
    <main>
      <Introduction />
      <hr />
      <Overview />
    </main>
  </Layout>
}
