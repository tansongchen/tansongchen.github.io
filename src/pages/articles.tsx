import React, { Component } from "react";
import Layout from "../components/Layout";
import Dropdown from "../components/Dropdown";
import { graphql, Link, PageProps } from "gatsby";
import Meta from "../components/Meta";
import { basename } from "../utils/metadata";

enum SortMethod {
  FromNewestToOldest,
  FromOldestToNewest,
}

const Introduction = () => (
  <section
    className="section"
    style={{
      backgroundImage:
        "linear-gradient(to bottom, rgba(255,230,230,0.5), rgba(255,255,255,0.5))",
    }}
  >
    <div
      className="container content is-max-desktop"
      style={{ fontSize: "125%" }}
    >
      <p>文以载道，文以会友。</p>
      <p>
        我喜欢用文字表达自我，无论是技术科普、成长感悟还是指点江山。写作其实是与自己对话：工作中理不清的概念写着写着就明白了，生活中缠绕的心结写着写着就解开了，还有那不吐不快的情感写着写着就释怀了。如果你有兴趣阅读更多我的文章，欢迎点击右上角用
        RSS 订阅。
      </p>
    </div>
  </section>
);

interface ArticleProps {
  title: string;
  date: Date;
  tags: string[];
  abstract: string;
  cover: string;
  slug: string;
}

interface TagProps {
  tag: string;
  activeTag?: string;
  changeTag: (activeTag?: string, tag?: string) => void;
}

const Tag = ({ tag, activeTag, changeTag }: TagProps) => {
  const className =
    "tag is-medium is-info" + (tag === activeTag ? "" : " is-light");
  return (
    <div
      key={tag}
      className={className}
      onClick={() => changeTag(activeTag, tag)}
    >
      {tag}
    </div>
  );
};

interface SelectorProps {
  sortMethod: SortMethod;
  changeSortMethod: (sortMethod: SortMethod) => void;
  intervalStart: Date;
  changeIntervalStart: (intervalStart: Date) => void;
  intervalEnd: Date;
  changeIntervalEnd: (intervalEnd: Date) => void;
  activeTag?: string;
  changeTag: (activeTag?: string, tag?: string) => void;
  allTags: string[];
}

const Selector = ({
  sortMethod,
  changeSortMethod,
  intervalStart,
  changeIntervalStart,
  intervalEnd,
  changeIntervalEnd,
  activeTag,
  changeTag,
  allTags,
}: SelectorProps) => {
  const getYear = (d: Date) => d.getFullYear().toString();
  const getSortMethod = (s: SortMethod) =>
    s === SortMethod.FromNewestToOldest
      ? "从新到旧"
      : s === SortMethod.FromOldestToNewest
      ? "从旧到新"
      : "";
  return (
    <section className="section">
      <div className="level container is-max-widescreen is-vcentered">
        <div className="level-left">
          <div className="tags">
            {allTags.map((tag) => (
              <Tag
                tag={tag}
                activeTag={activeTag}
                changeTag={changeTag}
                key={tag}
              />
            ))}
          </div>
        </div>
        <div className="level-right is-vcentered">
          <Dropdown<Date>
            options={[
              new Date("2019-01-01T00:00:00"),
              new Date("2020-01-01T00:00:00"),
              new Date("2021-01-01T00:00:00"),
            ]}
            callback={changeIntervalStart}
            current={intervalStart}
            display={getYear}
          />
          <div style={{ padding: ".5rem", display: "inline-flex" }}>至</div>
          <Dropdown<Date>
            options={[
              new Date("2019-12-31T23:59:59"),
              new Date("2020-12-31T23:59:59"),
              new Date("2021-12-31T23:59:59"),
            ]}
            callback={changeIntervalEnd}
            current={intervalEnd}
            display={getYear}
          />
          <div style={{ padding: ".5rem .8rem", display: "inline-flex" }}></div>
          <Dropdown<SortMethod>
            options={[
              SortMethod.FromNewestToOldest,
              SortMethod.FromOldestToNewest,
            ]}
            callback={changeSortMethod}
            current={sortMethod}
            display={getSortMethod}
          />
        </div>
      </div>
    </section>
  );
};

const format = (d: Date) =>
  `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;

const Article = ({
  title,
  date,
  slug,
  cover,
  tags,
  abstract,
}: ArticleProps) => (
  <article key={slug} className="container section">
    <Link to={`/${slug}/`}>
      <div className="box columns" style={{ padding: 0, overflow: "auto" }}>
        <div className="column" style={{ padding: 0 }}>
          <figure className="image is-2by1">
            <img src={cover} alt={cover} />
          </figure>
        </div>
        <div className="column content" style={{ padding: "1.5rem" }}>
          <h3>{title}</h3>
          <p>{format(date)}</p>
          <p>
            {tags.map((tag) => (
              <span
                key={tag}
                className="tag is-info is-light is-medium"
                style={{ margin: "0 3px" }}
              >
                {tag}
              </span>
            ))}
          </p>
          <p>{abstract}</p>
        </div>
      </div>
    </Link>
  </article>
);

interface MainState {
  sortMethod: SortMethod;
  intervalStart: Date;
  intervalEnd: Date;
  activeTag?: string;
}

interface MainProps {
  nodes: ArticleProps[];
}

interface ArticleListProps {
  sortMethod: SortMethod;
  intervalStart: Date;
  intervalEnd: Date;
  activeTag?: string;
  nodes: ArticleProps[];
}

const ArticleList = ({
  sortMethod: sort,
  intervalStart,
  intervalEnd,
  activeTag,
  nodes,
}: ArticleListProps) => {
  let dt = (blog: ArticleProps) => new Date(blog.date);
  let filteredArticles = activeTag
    ? nodes.filter(
        (blog: ArticleProps) =>
          intervalStart <= new Date(blog.date) &&
          new Date(blog.date) <= intervalEnd &&
          blog.tags.includes(activeTag)
      )
    : nodes.filter(
        (blog: ArticleProps) =>
          intervalStart <= new Date(blog.date) &&
          new Date(blog.date) <= intervalEnd
      );
  if (sort == SortMethod.FromNewestToOldest) {
    filteredArticles.sort((a, b) => dt(b).getTime() - dt(a).getTime());
  } else {
    filteredArticles.sort((a, b) => dt(a).getTime() - dt(b).getTime());
  }
  return (
    <section className="section">
      <div className="container is-max-widescreen">
        {filteredArticles.map(Article)}
      </div>
    </section>
  );
};

class Main extends Component<MainProps, MainState> {
  state: MainState = {
    sortMethod: SortMethod.FromNewestToOldest,
    intervalStart: new Date("2019-01-01T00:00:00"),
    intervalEnd: new Date("2021-12-31T23:59:59"),
    activeTag: undefined,
  };

  render() {
    const tagArrays = this.props.nodes.map((node) => node.tags);
    const tagArray = ([] as string[]).concat(...tagArrays);
    const allTags = Array.from(new Set(tagArray));
    const changeSortMethod = (sortMethod: SortMethod) => {
      this.setState({ sortMethod: sortMethod });
    };
    const changeIntervalStart = (intervalStart: Date) => {
      this.setState({ intervalStart: intervalStart });
    };
    const changeIntervalEnd = (intervalEnd: Date) => {
      this.setState({ intervalEnd: intervalEnd });
    };
    const changeTag = (activeTag?: string, tag?: string) => {
      activeTag === tag
        ? this.setState({ activeTag: undefined })
        : this.setState({ activeTag: tag });
    };
    return (
      <main>
        <Introduction />
        <hr />
        <Selector
          sortMethod={this.state.sortMethod}
          changeSortMethod={changeSortMethod}
          intervalStart={this.state.intervalStart}
          changeIntervalStart={changeIntervalStart}
          intervalEnd={this.state.intervalEnd}
          changeIntervalEnd={changeIntervalEnd}
          changeTag={changeTag}
          activeTag={this.state.activeTag}
          allTags={allTags}
        />
        <ArticleList {...this.state} nodes={this.props.nodes} />
      </main>
    );
  }
}

export default function ({ data }: PageProps<Queries.ArticlesQuery>) {
  const nodes: ArticleProps[] = data.allMarkdownRemark.nodes.map(
    ({ frontmatter, fileAbsolutePath }) => {
      return {
        title: frontmatter?.title || "Title",
        date: new Date(frontmatter?.date || "1970-01-01"),
        slug: "articles/" + basename(fileAbsolutePath || ""),
        tags: (frontmatter?.tags || []).map((s) => s || ""),
        abstract: frontmatter?.abstract || "",
        cover: frontmatter?.cover || "",
      };
    }
  );
  return (
    <Layout slug="articles">
      <Main nodes={nodes} />
    </Layout>
  );
}

export const query = graphql`
  query Articles {
    allMarkdownRemark {
      nodes {
        fileAbsolutePath
        frontmatter {
          title
          date
          tags
          cover
          abstract
        }
      }
    }
  }
`;

export const Head = () => <Meta title="文章" />;
