import React, { Component } from "react";
import { request } from "@octokit/request";
import { FaCodeBranch, FaEye, FaStar } from "react-icons/fa";

export interface RepositoryProps {
  owner: string;
  name: string;
}

interface RepositoryState {
  owner: { login: string };
  name: string;
  stargazers_count: number;
  forks_count: number;
  description: string;
  language: string;
  html_url: string;
  forks_url: string;
  stargazers_url: string;
  subscribers_count: number;
  subscribers_url: string;
}

class Repository extends Component<RepositoryProps, RepositoryState> {
  state: RepositoryState = {
    owner: { login: "" },
    name: "",
    stargazers_count: 0,
    forks_count: 0,
    subscribers_count: 0,
    description: "",
    language: "",
    html_url: "",
    forks_url: "",
    subscribers_url: "",
    stargazers_url: "",
  };
  async componentDidMount() {
    let data = (
      await request("GET /repos/{owner}/{repo}", {
        owner: this.props.owner,
        repo: this.props.name,
      })
    ).data;
    this.setState({
      ...data,
      description: data.description || "",
      language: data.language || "",
    });
  }
  render() {
    const {
      owner,
      name,
      stargazers_count,
      forks_count,
      subscribers_count,
      description,
      language,
      html_url,
      forks_url,
      stargazers_url,
      subscribers_url,
    }: RepositoryState = this.state;
    return (
      <div className="column is-half" key={html_url}>
        <article className="card">
          <header className="card-header">
            <p className="card-header-title">
              <a href={html_url}>
                <span style={{ fontWeight: "normal" }}>{owner.login} /</span>{" "}
                {name}
              </a>
              <span
                className="tag is-link is-light"
                style={{ fontWeight: "normal", margin: "0 1rem" }}
              >
                {language}
              </span>
            </p>
          </header>
          <div className="card-content">
            <p className="content">{description}</p>
          </div>
          <footer className="card-footer">
            <a href={subscribers_url} className="card-footer-item">
              <FaEye className="icon is-small" />
              <span style={{ padding: "0 .5rem" }}>{subscribers_count}</span>
            </a>
            <a href={stargazers_url} className="card-footer-item">
              <FaStar className="icon is-small" />
              <span style={{ padding: "0 .5rem" }}>{stargazers_count}</span>
            </a>
            <a href={forks_url} className="card-footer-item">
              <FaCodeBranch className="icon is-small" />
              <span style={{ padding: "0 .5rem" }}>{forks_count}</span>
            </a>
          </footer>
        </article>
      </div>
    );
  }
}

export default Repository;
