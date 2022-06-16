import "../styles/bulma.scss"
import "../styles/index.scss"
import React, { Component } from 'react'
import Layout from '../components/Layout'
import { request } from "@octokit/request";
import { faCodeBranch, faEye, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Introduction = () => <section className="section" style={{backgroundImage: "linear-gradient(to bottom, rgba(255,230,220,0.5), rgba(255,255,255,0.5))"}}>
  <div className="container content is-max-desktop" style={{fontSize: "125%"}}>
    <p>
      我无法理解我是如何从写代码中获得快乐的，直到我看到了《人月神话》中对程序员工作的如下描述：
    </p>
    <blockquote style={{backgroundColor: "transparent"}}>
      <p>
        ……乐趣还来自于工作在如此易于驾驭的介质上。程序员，就像诗人一样，几乎仅仅工作在单纯的思考中。程序员凭空地运用自己的想象，来建造自己的「城堡」。很少有这样的介质——创造的方式如此得灵活，如此得易于精炼和重建，如此得容易实现概念上的设想。……然而程序毕竟同诗歌不同，它是实实在在的东西；可以移动和运行，能独立产生可见的输出；能打印结果，绘制图形，发出声音，移动支架。神话和传说中的魔术在我们的时代已变成了现实。在键盘上键入正确的咒语，屏幕会活动、变幻，显示出前所未有的或是已经存在的事物。
      </p>
      <p>
        编程非常有趣，在于它不仅满足了我们内心深处进行创造的渴望，而且还愉悦了每个人内在的情感。
      </p>
    </blockquote>
    <p>
      以下是我参与或发起的若干开源项目：
    </p>
  </div>
</section>

interface RepositoryProps {
  owner: string,
  name: string
}

interface RepositoryState {
  owner: {login: string},
  name: string,
  stargazers_count: number,
  forks_count: number,
  description: string,
  language: string,
  html_url: string,
  forks_url: string,
  stargazers_url: string,
  subscribers_count: number,
  subscribers_url: string,
}

const repositories: RepositoryProps[] = [
  {name: "julia", owner: "JuliaLang"},
  {name: "Enzyme", owner: "wsmoses"},
  {name: "lammps", owner: "lammps"},
  {name: "deepks-kit", owner: "deepmodeling"},
  {name: "abacus-develop", owner: "deepmodeling"},
  {name: "PIMD.jl", owner: "tansongchen"},
  {name: "dppl-project", owner: "tansongchen"},
  {name: "AwesomeBig2Agent", owner: "tansongchen"},
  {name: "AwesomeLandlordBot", owner: "tansongchen"},
  {name: "GRE3000", owner: "tansongchen"},
];

class Repository extends Component<RepositoryProps, RepositoryState> {
  state: RepositoryState = {
    owner: {login: ""},
    name: "",
    stargazers_count: 0,
    forks_count: 0,
    subscribers_count: 0,
    description: "",
    language: "",
    html_url: "",
    forks_url: "",
    subscribers_url: "",
    stargazers_url: ""
  };
  async componentDidMount() {
    let data = (await request('GET /repos/{owner}/{repo}', {
      owner: this.props.owner,
      repo: this.props.name
    })).data;
    this.setState({...data, description: data.description || "", language: data.language || "" });
  }
  render() {
    const { owner, name, stargazers_count, forks_count, subscribers_count, description, language, html_url, forks_url, stargazers_url, subscribers_url }: RepositoryState = this.state;
    return <div className="column is-half" key={html_url}><article className="card">
      <header className="card-header">
        <p className="card-header-title">
          <a href={html_url}>
            <span style={{fontWeight: "normal"}}>{owner.login} /</span> {name}
          </a>
          <span className="tag is-link is-light" style={{fontWeight: "normal", margin: "0 1rem"}}>{language}</span>
        </p>
      </header>
      <div className="card-content">
        <p className="content">
          {description}
        </p>
      </div>
      <footer className="card-footer">
        <a href={subscribers_url} className="card-footer-item">
          <FontAwesomeIcon icon={faEye} className="icon is-small"/>
          <span style={{padding: "0 .5rem"}}>{subscribers_count}</span>
        </a>
        <a href={stargazers_url} className="card-footer-item">
          <FontAwesomeIcon icon={faStar} className="icon is-small"/>
          <span style={{padding: "0 .5rem"}}>{stargazers_count}</span>
        </a>
        <a href={forks_url} className="card-footer-item">
          <FontAwesomeIcon icon={faCodeBranch} className="icon is-small"/>
          <span style={{padding: "0 .5rem"}}>{forks_count}</span>
        </a>
      </footer>
    </article></div>
  }
}

interface GalleryProps {repositories: RepositoryProps[]}

const Gallery = ({ repositories }: GalleryProps) => <section className="section">
  <div className="container is-max-desktop">
    <div className="columns is-multiline">
      {repositories.map(x => <Repository {...x} />)}
    </div>
  </div>
</section>

const Code = () => <Layout slug="/code/">
  <Introduction />
  <hr />
  <Gallery repositories={repositories}/>
</Layout>

export default Code
