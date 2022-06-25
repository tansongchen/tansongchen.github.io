import "../../styles/index.scss"
import React, { Fragment, ReactElement } from "react"
import { faCode, faMusic, faStickyNote } from "@fortawesome/free-solid-svg-icons"
import Layout from "../../components/Layout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(220,230,255,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop">
    <h1>Op. 1（钢琴曲）</h1>
    <h2>No. 5「暮雨和晚霞」</h2>
    <p style={{textAlign: "center"}}>为张睿涵 25 岁生日而作</p>
    <p>
      本曲由两个部分组成。第一部分（「暮雨」）在 b 小调上，是一个夜曲风格的片段。引子由加了大量装饰音的主三和弦和减七和弦下行琶音构成，有如雨滴随风飘落，营造出一种空灵的氛围。主题段旋律甜美但和声略显忧郁，好似是若有所思，又像是欲言又止。第二部分（「晚霞」）在 D 大调上， 速度较前半部分有所加快。旋律由第一部分的旋律素材简缩而成，并由左手和右手分别演奏一次；简单而明亮的和弦构成的装饰性的琶音先在高音区演奏而后转移到中音区，有如彩霞随着乌云散去出现在我们的视野中。尾声的节奏型与引子类似，但是和声材料使用了不加装饰的主属和弦，与引子形成对比。
    </p>
    <p>
      本曲是一位友人生日时为其即兴创作的，旨在表现生活中虽然有许多像减七和弦那样的不如意，但如果能够保持着赤子之心和对美好生活的追求，我们总能走出重重迷雾迎接新的人生篇章；而那些遗憾事过境迁后也会变为美好的回忆。剑桥市因临海而多雨，常常在傍晚时雨过天晴、留下美丽的霞云与落日辉映，本曲因此得名。
    </p>
  </div>
</section>

const DownloadItem = ({ name, url, icon }) => <div className="column" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
  <div style={{padding: "1rem"}}>
    <FontAwesomeIcon icon={icon}/>
    <span>  {name}</span>
  </div>
  <div style={{padding: "1rem"}}>
    <a href={url}>
      <button className="button is-info">下载</button>
    </a>
  </div>
</div>

const Download = () => <section className="section">
  <div className="container is-max-desktop">
    <div className="columns">
      <DownloadItem name={"音频"} url={"/op1no5.mp3"} icon={faMusic}/>
      <DownloadItem name={"乐谱"} url={"/op1no5.pdf"} icon={faStickyNote}/>
      <DownloadItem name={"源码"} url={"/op1no5.ly"} icon={faCode}/>
    </div>
  </div>
</section>

const Music = () => {
  return (
    <Fragment>
      <Layout slug="music/op1no5">
        <main>
          <Introduction />
          <hr />
          <Download />
        </main>
      </Layout>
    </Fragment>
  )
}

export default Music
