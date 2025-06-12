import React, { useEffect, type FC } from "react";
import { request } from "@octokit/request";
import { FaCodeBranch, FaEye, FaStar } from "react-icons/fa";
import useSWRImmutable from "swr/immutable";

interface RepositoryProps {
  owner: string;
  repo: string;
  [k: string]: any
}

function Repository({ owner, repo }: RepositoryProps) {
  const { data, error } = useSWRImmutable(
    ["GET /repos/{owner}/{repo}", { owner, repo }],
    ([route, options]) => request(route, options).then((res) => res.data),
    { shouldRetryOnError: false }
  );
  if (!data || error) return <div></div>;
  const {
    stargazers_count,
    forks_count,
    subscribers_count,
    description,
    language,
    html_url,
    forks_url,
    stargazers_url,
    subscribers_url,
  } = data;
  return (
    <div className="column is-half" key={html_url}>
      <article className="card">
        <header className="card-header">
          <p className="card-header-title">
            <a href={html_url}>
              <span style={{ fontWeight: "normal" }}>{owner} /</span> {repo}
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

export default Repository;
