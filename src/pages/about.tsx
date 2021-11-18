import "../styles/index.scss"
import React, { Fragment, ReactElement } from "react"
import { faCalendar, faCheckCircle, faMapMarker, faPlayCircle } from "@fortawesome/free-solid-svg-icons"
import Layout from "../components/Layout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StaticImage } from "gatsby-plugin-image"

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(220,230,255,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      在过去的十年间，我有幸能够在尊重个性、开放包容的环境中成长，从奇妙无比的大自然中洞察世界的真理，并与富有智慧的人们一起开展改变世界的工作。在不同的时期，我与人类知识宝库中的不同角落相遇，在各色风景中流连忘返；但不变的是我对成长为专业人士的向往，以及对技术改变世界的坚信不疑。作为回报，世界亦以它的温柔待我，让我在有意义的工作中度过充满希望、朝气蓬勃的生活，也让我结识了许多志同道合的好友。
    </p>
    <p>
      希望这些经历可以更好地让您了解我自己。另外，如果您认为我的专长可能对您有所帮助，欢迎您通过页面下方的联系方式与我联系。
    </p>
  </div>
</section>

interface EducationProps {
  photo: ReactElement,
  institutionName: string,
  institutionUrl: string,
  degrees: string[][],
  duration: string,
  location: string,
  description: string
}

const EducationItem = ({ photo, institutionName, institutionUrl, degrees, duration, location, description } : EducationProps) => <article className="section container is-max-desktop">
  <div className="box columns">
    <div className="column">
      <figure className="image is-4by3">
        <a href={institutionUrl}>
          {photo}
        </a>
      </figure>
    </div>
    <div className="column content" style={{padding: "2rem"}}>
      <h3 className="has-text-centered">
        {institutionName}
      </h3>
      <div className="has-text-centered" style={{margin: "1.5rem auto"}}>
        {degrees.map(([degree, departmentUrl]) => <Fragment key={degree}><a href={departmentUrl}>{degree}</a><br /></Fragment>)}
      </div>
      <div className="columns">
        <div className="column" style={{margin: "0 2%", padding: ".5rem"}}>
          <FontAwesomeIcon icon={faCalendar} className="icon is-small" style={{width: "10%"}}/>
          <p className="has-text-centered" style={{display: "inline-block"}}>&nbsp; &nbsp; {duration}</p>
        </div>
        <div className="column" style={{margin: "0 2%", padding: ".5rem"}}>
          <FontAwesomeIcon icon={faMapMarker} className="icon is-small" style={{width: "10%"}}/>
          <p className="has-text-centered" style={{display: "inline-block"}}>&nbsp; &nbsp; {location}</p>
        </div>
      </div>
      <p>{description}</p>
    </div>
  </div>
</article>

const imageDomain = "https://cdn.jsdelivr.net/gh/tansongchen/images@master/";

const mit: EducationProps = {
  photo: <StaticImage src={imageDomain + "mit.webp"} alt="mit" />,
  institutionName: "麻省理工学院",
  institutionUrl: "https://mit.edu",
  degrees: [["理学硕士，计算科学与工程", "https://cse.mit.edu"]],
  location: "Cambridge, MA",
  duration: "2021 - 2023",
  description: "作为计算科学与工程中心开设的研究型硕士项目，我在这里接受高质量的计算相关课程的训练，并与来自全校各系的教授和学生共同以跨学科的方式探讨计算问题。"
}

const ucla: EducationProps = {
  photo: <StaticImage src={imageDomain + "ucla.webp"} alt="ucla" />,
  institutionName: "加州大学洛杉矶分校",
  institutionUrl: "https://ucla.edu",
  degrees: [["学期交换", "https://chemistry.ucla.edu"]],
  location: "Los Angeles, CA",
  duration: "2019 - 2019",
  description: "大三时，我赴加州大学洛杉矶分校进行一学期的交换。沐浴在加州的暖阳中，我与校园吉祥物加州棕熊 Bruin 共同感受校园的学术氛围。"
}

const pku: EducationProps = {
  photo: <StaticImage src={imageDomain + "pku.webp"} alt="pku" />,
  institutionName: "北京大学",
  institutionUrl: "https://pku.edu.cn",
  degrees: [["理学学士，化学", "https://chem.pku.edu.cn"], ["理学学士，物理", "https://phy.pku.edu.cn"]],
  location: "北京市",
  duration: "2017 - 2021",
  description: "未名湖畔、博雅塔下，细推物理须行乐，何用浮名绊此身。四年间，我在化学和物理双学位中取得 GPA 3.86 / 4，并在毕业时获未名学士荣誉。"
}

const rdfz: EducationProps = {
  photo: <StaticImage src={imageDomain + "rdfz.webp"} alt="rdfz" />,
  institutionName: "中国人民大学附属中学",
  institutionUrl: "http://www.rdfz.cn/",
  degrees: [["初中、高中，早培班项目", "http://www.rdfz.cn/"]],
  location: "北京市",
  duration: "2011 - 2017",
  description: "海淀黄庄的路口承载了我快乐的少年时光；我曾随合唱团出国交流演出，也曾参与食虫植物温室的建设。高一时在第 29 届化学奥林匹克决赛中取得金牌，并提前一年毕业。"
}

interface PrefaceProps {
  title: string,
  quote: string,
  description: string
}

const Preface = ({ title, quote, description }: PrefaceProps) => <div className="container content is-medium has-text-centered">
  <h2>{title}</h2>
  <blockquote className="quote">{quote}</blockquote>
  <p>
    {description}
  </p>
</div>

const educationPreface: PrefaceProps = {
  title: "教育经历",
  quote: "恰同学少年，风华正茂；书生意气，挥斥方遒",
  description: "",
}

const Education = () => <section className="section">
  <Preface {...educationPreface}/>
  <EducationItem {...mit}/>
  <EducationItem {...ucla}/>
  <EducationItem {...pku}/>
  <EducationItem {...rdfz}/>
</section>

const experiencePreface = {
  title: "学术与职业经历",
  quote: "曾记否，到中流击水，浪遏飞舟",
  description: ""
}

interface ExperienceData {
  title: string,
  company: string,
  companyUrl: string,
  photo: ReactElement,
  supervisor?: string,
  description: ReactElement,
  duration: string,
  location: string,
  isCurrent?: boolean
}

const ExperienceItem = ({ title, company, companyUrl, photo, description, duration, location, isCurrent }: ExperienceData) => <article className="timeline-item">
  <div className="timeline-marker is-icon">
    {isCurrent ? <FontAwesomeIcon icon={faPlayCircle} className="icon is-info" /> : <FontAwesomeIcon icon={faCheckCircle} className="icon is-info" />}
  </div>
  <div className="timeline-content" style={{width: "100%"}}>
    <div className="columns">
      <div className="column content" style={{padding: "1rem 2rem"}}>
        <div className="level">
          <div className="level-item" style={{display: "inline"}}>
            <span style={{fontSize: "1.5rem"}}>{title}</span>
          </div>
          <div className="level-item" style={{display: "inline"}}>
            <p> @ {company}</p>
          </div>
        </div>
        <p><FontAwesomeIcon icon={faCalendar} className="icon is-small"/>&nbsp;&nbsp;{duration}</p>
        <p><FontAwesomeIcon icon={faMapMarker} className="icon is-small"/>&nbsp;&nbsp;{location}</p>
        {description}
      </div>
      <div className="column">
        <figure className="image box" style={{textAlign: "center", padding: 0, overflow: "auto"}}>
          <a href={companyUrl}>
            {photo}
          </a>
        </figure>
      </div>
    </div>
  </div>
</article>

const julia: ExperienceData = {
  title: "研究助理",
  company: "麻省理工学院 Julia 实验室",
  companyUrl: "https://julia.mit.edu",
  photo: <StaticImage src={imageDomain + "stata.webp"} alt="stata" />,
  description: <p>在 Julia 实验室，我们利用 Julia 语言的一系列编译基础设施（元编程、IR 反射和 LLVM 代码生成）研究如何将高级语言表达的抽象语义有效地编译为并行计算、异构计算等高性能场景下的机器代码。</p>,
  duration: "2021 年 8 月至今",
  location: "Cambridge, MA",
  isCurrent: true
}

const dptech: ExperienceData = {
  title: "算法工程师实习",
  company: "北京深势科技有限公司",
  companyUrl: "https://dp.tech/index.html",
  photo: <StaticImage src={imageDomain + "dptech.webp"} alt="dptech" />,
  description: <p>在深势科技，我们利用 DeePKS 方法构建参数化的密度泛函模型，并设计有效的训练方案来系统改善这样的模型；我们还将模型部署到 ABACUS 等开源密度泛函软件上实现高效的推理。</p>,
  duration: "2021 年 3 月至 2021 年 7 月",
  location: "北京市"
}

const binz: ExperienceData = {
  title: "研究助理实习",
  company: "麻省理工学院",
  companyUrl: "https://zhanggroup.mit.edu",
  photo: <StaticImage src={imageDomain + "mitchem.webp"} alt="mitchem" />,
  description: <p>在 Zhang 组，我们利用深度生成模型对 DNA 体系进行粗粒化建模，并利用噪声对比学习进行优化，相较于传统的 force-matching 方法在统计量的准确性上得到了较大的提升。</p>,
  duration: "2020 年 6 月至 2020 年 10 月",
  location: "Cambridge, MA (Remote)"
}

const thg: ExperienceData = {
  title: "访问学者",
  company: "加州大学伯克利分校",
  companyUrl: "https://thglab.berkeley.edu",
  photo: <StaticImage src={imageDomain + "stanley.webp"} alt="stanley" />,
  description: <Fragment>
    <p>在 Head-Gordon 组，我们发展了一种利用扩展 Langrange 量对经典电荷平衡模型进行近似模拟的方法，并基于 MPI 高效地在大规模分子体系中实现了这一方法。该方法已加入了开源分子动力学软件 LAMMPS。请参考以下两篇发表的文章：</p>
    <ul>
      <li><a href="https://doi.org/10.1021/acs.jctc.1c00118">I. Leven, H. Hao, <strong>S. Tan</strong>, ... T. Head‐Gordon, <em>J. Chem. Theory Comput.</em> <b>2021.</b></a></li>
      <li><a href="https://doi.org/10.1021/acs.jctc.0c00514"><strong>S. Tan</strong>, I. Leven, D. An, L. Lin, T. Head‐Gordon, <em>J. Chem. Theory Comput.</em> <b>2020.</b></a></li>
    </ul>
  </Fragment>,
  duration: "2019 年 12 月至 2020 年 3 月",
  location: "Berkeley, CA"
}

const DateTag = ({date}) => <header className="timeline-header">
  <span className="tag is-medium is-info" style={{minWidth: "4rem"}}>{date}</span>
</header>

const Experience = () => <section className="section">
  <Preface {...experiencePreface}/>
  <div className="timeline container is-max-desktop">
    <DateTag date="..." />
    {/* <DateTag date={2022} /> */}
    <ExperienceItem {...julia}/>
    <ExperienceItem {...dptech}/>
    <DateTag date="2021" />
    <ExperienceItem {...binz}/>
    <DateTag date="2020" />
    <ExperienceItem {...thg}/>
    <DateTag date="2019" />
  </div>
</section>

const About = () => {
  return (
    <Fragment>
      <Layout slug="about">
        <main>
          <Introduction />
          <hr />
          <Education />
          <hr />
          <Experience />
        </main>
      </Layout>
    </Fragment>
  )
}

export default About
